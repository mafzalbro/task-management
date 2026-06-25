import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_EPICS, GET_SPRINTS } from '../../shared/graphql';
import type { Epic, Sprint } from '../../shared/types';
import { Layers, Calendar, ChevronRight } from 'lucide-react';

const RoadmapView: React.FC<{ projectId: string }> = ({ projectId }) => {
    const { data: epicsData } = useQuery(GET_EPICS, { variables: { projectId } });
    const { data: sprintsData } = useQuery(GET_SPRINTS, { variables: { projectId } });

    const epics: Epic[] = epicsData?.epics || [];
    const sprints: Sprint[] = sprintsData?.sprints || [];

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    return (
        <div className="main-content">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 style={{ fontSize: '26px', fontWeight: 800 }}>Roadmap</h2>
                    <p className="text-muted">Long-term strategy and epic tracking.</p>
                </div>
            </div>

            <div style={{ background: 'white', borderRadius: '20px', border: '1px solid var(--border-light)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
                {/* Timeline Header */}
                <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', borderBottom: '1px solid var(--border-light)' }}>
                    <div style={{ padding: '20px 24px', fontWeight: 800, fontSize: '14px', color: 'var(--text-muted)', borderRight: '1px solid var(--border-light)' }}>
                        EPICS
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)' }}>
                        {months.map(m => (
                            <div key={m} style={{ padding: '20px 8px', textAlign: 'center', fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', borderRight: '1px solid var(--bg-subtle)' }}>
                                {m}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Epic Rows */}
                {epics.length > 0 ? (
                    epics.map(epic => (
                        <div key={epic.id} style={{ display: 'grid', gridTemplateColumns: '300px 1fr', borderBottom: '1px solid var(--bg-subtle)', minHeight: '80px' }}>
                            <div style={{ padding: '20px 24px', borderRight: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ width: 32, height: 32, borderRadius: '8px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Layers size={18} />
                                </div>
                                <div>
                                    <div style={{ fontSize: '14px', fontWeight: 700 }}>{epic.name}</div>
                                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{epic.status}</div>
                                </div>
                            </div>
                            <div style={{ position: 'relative', background: 'var(--bg-main)' }}>
                                {/* Mock Epic Bar */}
                                <div style={{
                                    position: 'absolute',
                                    left: '10%',
                                    right: '40%',
                                    top: '24px',
                                    bottom: '24px',
                                    background: 'var(--primary)',
                                    borderRadius: '12px',
                                    padding: '0 16px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    color: 'white',
                                    fontSize: '11px',
                                    fontWeight: 800,
                                    boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)'
                                }}>
                                    ACTIVE PHASE
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div style={{ padding: '80px', textAlign: 'center' }}>
                        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🗺️</div>
                        <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '8px' }}>No Epics Defined</h3>
                        <p className="text-muted">Create epics to track large initiatives over time.</p>
                        <button className="btn-primary" style={{ marginTop: '24px', margin: '0 auto' }}>
                            Create First Epic
                        </button>
                    </div>
                )}
            </div>

            {/* Sprints Timeline */}
            <div style={{ marginTop: '48px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '24px' }}>Sprint Schedule</h3>
                <div className="flex-col gap-3">
                    {sprints.map(sprint => (
                        <div key={sprint.id} className="glass" style={{ padding: '16px 24px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div className="flex items-center gap-4">
                                <Calendar size={18} className="text-muted" />
                                <span style={{ fontWeight: 700 }}>{sprint.name}</span>
                                <span className="text-muted" style={{ fontSize: '13px' }}>{sprint.startDate} — {sprint.endDate}</span>
                            </div>
                            <ChevronRight size={16} className="text-muted" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RoadmapView;
