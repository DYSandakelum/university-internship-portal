param(
    [string]$BaseUrl = "http://localhost:5000/api"
)

$ErrorActionPreference = 'Stop'

function Assert-True {
    param(
        [bool]$Condition,
        [string]$Message
    )
    if (-not $Condition) {
        throw "ASSERT FAILED: $Message"
    }
}

function Assert-NotNull {
    param(
        $Value,
        [string]$Message
    )
    if ($null -eq $Value) {
        throw "ASSERT FAILED: $Message"
    }
}

function Write-Step {
    param([string]$Text)
    Write-Host "\n=== $Text ===" -ForegroundColor Cyan
}

function Invoke-Json {
    param(
        [string]$Method,
        [string]$Url,
        [hashtable]$Headers = $null,
        $BodyObject = $null
    )

    if ($null -ne $BodyObject) {
        $bodyJson = $BodyObject | ConvertTo-Json -Depth 12
        return Invoke-RestMethod -Method $Method -Uri $Url -Headers $Headers -ContentType 'application/json' -Body $bodyJson
    }

    return Invoke-RestMethod -Method $Method -Uri $Url -Headers $Headers
}

try {
    Write-Step "Demo login"
    $demo = Invoke-Json -Method Post -Url "$BaseUrl/auth/demo-login"
    Assert-NotNull $demo.token "Demo login did not return token"
    $token = $demo.token
    $authHeaders = @{ Authorization = "Bearer $token" }

    Write-Step "Recommended jobs"
    $reco = Invoke-Json -Method Get -Url "$BaseUrl/jobs/recommended" -Headers $authHeaders
    Assert-True ($reco.jobs -is [System.Array]) "/jobs/recommended did not return jobs array"
    Assert-True ($reco.jobs.Count -gt 0) "/jobs/recommended returned 0 jobs"

    $job = $reco.jobs[0]
    Assert-NotNull $job._id "Recommended job missing _id"
    Assert-True ([string]::IsNullOrWhiteSpace([string]$job.title) -eq $false) "Recommended job missing title"
    Assert-True ([string]::IsNullOrWhiteSpace([string]$job.company) -eq $false) "Recommended job missing company"

    Write-Step "Save job -> verify appears in saved list"
    $saveRes = Invoke-Json -Method Post -Url "$BaseUrl/jobs/save" -Headers $authHeaders -BodyObject @{ jobId = $job._id }
    Assert-True ($saveRes.message -match "saved" -or $saveRes.message -match "already") "Unexpected save response message"

    $saved = Invoke-Json -Method Get -Url "$BaseUrl/jobs/saved" -Headers $authHeaders
    Assert-True ($saved.savedJobs -is [System.Array]) "/jobs/saved did not return savedJobs array"
    $match = @($saved.savedJobs | Where-Object { $_.jobId -and ("$($_.jobId._id)" -eq "$($job._id)") })
    Assert-True ($match.Count -ge 1) "Saved job not found in /jobs/saved after saving"

    $savedRecord = $match | Select-Object -First 1
    Assert-NotNull $savedRecord._id "Saved job record missing _id"

    Write-Step "Remove saved job -> verify removed"
    $removeRes = Invoke-Json -Method Delete -Url "$BaseUrl/jobs/save/$($savedRecord._id)" -Headers $authHeaders
    Assert-True ($removeRes.message -match "removed") "Unexpected remove response message"

    $savedAfter = Invoke-Json -Method Get -Url "$BaseUrl/jobs/saved" -Headers $authHeaders
    $stillThere = @($savedAfter.savedJobs | Where-Object { $_.jobId -and ("$($_.jobId._id)" -eq "$($job._id)") })
    Assert-True ($stillThere.Count -eq 0) "Saved job still present after deletion"

    Write-Step "Search jobs (public)"
    $search = Invoke-Json -Method Get -Url "$BaseUrl/jobs/search?q=Intern&location=Remote"
    Assert-True ($search.jobs -is [System.Array]) "/jobs/search did not return jobs array"

    Write-Step "Notification settings persist"
    $settingsBody = @{ emailNotifications = $false; newJobAlerts = $false; deadlineReminders = $true; applicationUpdates = $false }
    $settingsRes = Invoke-Json -Method Put -Url "$BaseUrl/notifications/settings" -Headers $authHeaders -BodyObject $settingsBody
    Assert-NotNull $settingsRes.notificationSettings "No notificationSettings returned"
    Assert-True ($settingsRes.notificationSettings.deadlineReminders -eq $true) "deadlineReminders did not persist"

    $me = Invoke-Json -Method Get -Url "$BaseUrl/auth/me" -Headers $authHeaders
    Assert-NotNull $me.user "auth/me missing user"
    Assert-NotNull $me.user.notificationSettings "auth/me missing notificationSettings (schema persistence issue)"

    Write-Step "Interviews: roles -> papers -> start attempt -> submit"
    $rolesRes = Invoke-Json -Method Get -Url "$BaseUrl/interviews/roles" -Headers $authHeaders
    Assert-True ($rolesRes.roles -is [System.Array]) "interviews/roles did not return roles array"
    Assert-True ($rolesRes.roles.Count -gt 0) "No interview roles found (seed missing?)"

    $role = [string]$rolesRes.roles[0]
    $encodedRole = [System.Uri]::EscapeDataString($role)

    $papersRes = Invoke-Json -Method Get -Url "$BaseUrl/interviews/roles/$encodedRole/papers" -Headers $authHeaders
    Assert-True ($papersRes.papers -is [System.Array]) "papers endpoint did not return papers array"
    Assert-True ($papersRes.papers.Count -gt 0) "No papers found for role"

    $paperNumber = [int]$papersRes.papers[0]
    $attemptStart = Invoke-Json -Method Post -Url "$BaseUrl/interviews/attempts/start" -Headers $authHeaders -BodyObject @{ role = $role; paperNumber = $paperNumber }
    Assert-NotNull $attemptStart.attempt "Attempt start missing attempt"
    Assert-NotNull $attemptStart.attempt.id "Attempt start missing attempt.id"
    Assert-True ($attemptStart.questions.Count -eq 10) "Attempt start did not return 10 questions"

    $attemptId = $attemptStart.attempt.id
    $answers = @()
    foreach ($q in $attemptStart.questions) {
        $answers += @{ questionId = $q.id; selectedOptionIndex = 0 }
    }

    $submit = Invoke-Json -Method Post -Url "$BaseUrl/interviews/attempts/$attemptId/submit" -Headers $authHeaders -BodyObject @{ answers = $answers }
    Assert-NotNull $submit.attempt "Submit missing attempt"
    Assert-NotNull $submit.attempt.score "Submit missing score"

    Write-Step "Opportunity: calculate -> update status"
    $calc = Invoke-Json -Method Post -Url "$BaseUrl/opportunity/calculate/$($job._id)" -Headers $authHeaders
    Assert-True ($calc.success -eq $true) "Opportunity calculate did not return success=true"
    Assert-NotNull $calc.data "Opportunity calculate missing data"
    Assert-NotNull $calc.data._id "Opportunity calculate missing data._id"

    $oppId = $calc.data._id
    $patch = Invoke-Json -Method Patch -Url "$BaseUrl/opportunity/$oppId/status" -Headers $authHeaders -BodyObject @{ applicationStatus = 'applied' }
    Assert-True ($patch.success -eq $true) "Opportunity status patch did not return success=true"
    Assert-True ($patch.data.applicationStatus -eq 'applied') "Opportunity status not updated to applied"

    Write-Step "Opportunity: plan application (get/create/update)"
    $planGet = Invoke-Json -Method Get -Url "$BaseUrl/opportunity/$oppId/plan" -Headers $authHeaders
    Assert-True ($planGet.success -eq $true) "Plan GET did not return success=true"

    $planCreate = Invoke-Json -Method Post -Url "$BaseUrl/opportunity/$oppId/plan" -Headers $authHeaders -BodyObject @{}
    Assert-True ($planCreate.success -eq $true) "Plan CREATE did not return success=true"
    Assert-NotNull $planCreate.data "Plan CREATE missing data"
    Assert-True ($planCreate.data.items.Count -ge 1) "Plan CREATE returned no items"

    $firstItem = $planCreate.data.items[0]
    Assert-NotNull $firstItem._id "Plan item missing _id"

    $planUpdate = Invoke-Json -Method Patch -Url "$BaseUrl/opportunity/$oppId/plan/items/$($firstItem._id)" -Headers $authHeaders -BodyObject @{ isDone = $true }
    Assert-True ($planUpdate.success -eq $true) "Plan item update did not return success=true"

    Write-Host "\nALL JOB-MATCHING SMOKE TESTS PASSED" -ForegroundColor Green
    exit 0
}
catch {
    Write-Host "\nSMOKE TEST FAILED" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}
