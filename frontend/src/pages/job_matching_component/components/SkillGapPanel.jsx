import React, { useEffect, useMemo, useState } from 'react';
import { FiBook, FiChevronDown, FiExternalLink, FiCheckCircle, FiCircle, FiVideo, FiFileText, FiBookOpen, FiClock } from 'react-icons/fi';
import './SkillGapPanel.css';

function SkillGapPanel({ skills = [], skillMatchScore = 0 }) {
    const [expandedSkill, setExpandedSkill] = useState(null);

    const normalizedSkills = useMemo(() => {
        return (Array.isArray(skills) ? skills : []).map((skillObj) => {
            const name = typeof skillObj === 'string' ? skillObj : skillObj?.skill;
            const importance = typeof skillObj === 'string' ? undefined : skillObj?.importance;
            return { name: String(name || '').trim(), importance };
        }).filter((s) => Boolean(s.name));
    }, [skills]);

    useEffect(() => {
        // When the selected job changes, missing skills change; collapse any previously expanded row.
        setExpandedSkill(null);
    }, [normalizedSkills]);

    const buildLinksForSkill = (skill) => {
        const q = encodeURIComponent(skill);
        const qDocs = encodeURIComponent(`${skill} documentation`);
        const qVideo = encodeURIComponent(`${skill} tutorial`);

        return {
            coursera: `https://www.coursera.org/search?query=${q}`,
            udemy: `https://www.udemy.com/courses/search/?q=${q}`,
            linkedin: `https://www.linkedin.com/learning/search?keywords=${q}`,
            docs: `https://www.google.com/search?q=${qDocs}`,
            video: `https://www.youtube.com/results?search_query=${qVideo}`
        };
    };

    const getLearningResources = (skill) => {
        const links = buildLinksForSkill(skill);
        return [
            { title: `${skill} Fundamentals`, platform: 'Coursera', link: links.coursera },
            { title: `Learn ${skill}`, platform: 'Udemy', link: links.udemy },
            { title: `${skill} Mastery`, platform: 'LinkedIn Learning', link: links.linkedin }
        ];
    };

    const getSkillPriority = (skill) => {
        if (skills.length > 0 && skillMatchScore < 50) {
            return 'high';
        }
        if (skillMatchScore < 70) {
            return 'medium';
        }
        return 'low';
    };

    if (!normalizedSkills || normalizedSkills.length === 0) {
        return (
            <div className="skill-gap-container">
                <h3 className="skill-title">
                    <FiBook /> Skill Alignment
                </h3>
                <div className="no-gap">
                    <p><FiCheckCircle style={{ marginRight: '6px', verticalAlign: 'text-bottom' }} />Great! You have most required skills.</p>
                    <p>Focus on strengthening existing abilities.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="skill-gap-container">
            <h3 className="skill-title">
                <FiBook /> Missing Skills ({normalizedSkills.length})
            </h3>

            <div className="skill-match-summary">
                <p className="summary-text">You're matching <strong>{skillMatchScore}%</strong> of required skills</p>
                <div className="summary-bar">
                    <div 
                        className="summary-fill"
                        style={{ width: `${skillMatchScore}%` }}
                    ></div>
                </div>
            </div>

            <div className="missing-skills-list">
                {normalizedSkills.map((skillObj, index) => {
                    const skill = skillObj.name;
                    const importance = skillObj.importance || getSkillPriority(skill);
                    const links = buildLinksForSkill(skill);
                    
                    return (
                        <div
                            key={index}
                            className={`skill-item priority-${importance}`}
                            onClick={() => setExpandedSkill(expandedSkill === index ? null : index)}
                        >
                            {/* Skill Header */}
                            <div className="skill-header">
                                <div className="skill-left">
                                    <span className={`skill-importance ${importance}`}>
                                        <FiCircle size={10} />
                                    </span>
                                    <span className="skill-name">{skill}</span>
                                </div>
                                <div className="skill-right">
                                    <span className={`importance-badge ${importance}`}>
                                        {importance.toUpperCase()}
                                    </span>
                                    <FiChevronDown 
                                        className={`chevron ${expandedSkill === index ? 'rotated' : ''}`}
                                    />
                                </div>
                            </div>

                            {/* Expanded Resources */}
                            {expandedSkill === index && (
                                <div className="skill-resources">
                                    <h4 className="resources-title">Recommended Learning</h4>
                                    <div className="resources-list">
                                        {getLearningResources(skill).map((resource, ridx) => (
                                            <a
                                                key={ridx}
                                                href={resource.link}
                                                className="resource-item"
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                <div className="resource-info">
                                                    <p className="resource-title">{resource.title}</p>
                                                    <p className="resource-platform">{resource.platform}</p>
                                                </div>
                                                <FiExternalLink className="resource-icon" />
                                            </a>
                                        ))}
                                    </div>

                                    <div className="quick-links">
                                        <a className="quick-link" href={links.video} target="_blank" rel="noreferrer">
                                            <FiVideo style={{ marginRight: '6px' }} /> Video Tutorial
                                        </a>
                                        <a className="quick-link" href={links.docs} target="_blank" rel="noreferrer">
                                            <FiFileText style={{ marginRight: '6px' }} /> Documentation
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Learning Path Suggestion */}
            <div className="learning-path">
                <h4 className="path-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><FiBookOpen /> Suggested Learning Path</h4>
                <div className="path-timeline">
                    <div className="path-step">
                        <div className="step-number">1</div>
                        <div className="step-content">
                            <p className="step-title">Learn Foundations (1-2 weeks)</p>
                            <p className="step-desc">Focus on most important high-priority skills</p>
                        </div>
                    </div>
                    <div className="path-step">
                        <div className="step-number">2</div>
                        <div className="step-content">
                            <p className="step-title">Practice Projects (2-3 weeks)</p>
                            <p className="step-desc">Build real-world projects showcasing new skills</p>
                        </div>
                    </div>
                    <div className="path-step">
                        <div className="step-number">3</div>
                        <div className="step-content">
                            <p className="step-title">Portfolio Update (1 week)</p>
                            <p className="step-desc">Add projects to your portfolio and resume</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Time Estimate */}
            <div className="time-estimate">
                <p className="estimate-text">
                    <FiClock style={{ marginRight: '6px', verticalAlign: 'text-bottom' }} />Est. time to learn all skills: <strong>4-6 weeks</strong>
                </p>
            </div>
        </div>
    );
}

export default SkillGapPanel;
