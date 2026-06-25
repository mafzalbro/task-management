import React from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_SPRINTS, CREATE_SPRINT, GET_TASKS, UPDATE_TASK } from '../../shared/graphql';
import type { Post, Sprint } from '../../shared/types';
import { Plus, BarChart2, MoreVertical, Play } from 'lucide-react';

const SprintsView: React.FC<{ projectId: string }> = ({ projectId }) => {
    const { data: sprintsData, refetch: refetchSprints } = useQuery(GET_SPRINTS, { variables: { projectId } });
    const { data: backlogData, refetch: refetchBacklog } = useQuery(GET_TASKS, { variables: { projectId, status: 'BACKLOG' } });

    const [createSprint] = useMutation(CREATE_SPRINT, { onCompleted: () => refetchSprints() });
    const [updateTask] = useMutation(UPDATE_TASK, { onCompleted: () => { refetchSprints(); refetchBacklog(); } });

    const sprints: Sprint[] = sprintsData?.sprints || [];
    const backlog: Post[] = backlogData?.tasks || [];

    const handleCreateSprint = () => {
        const name = prompt('Sprint Name');
        if (!name) return;
        createSprint({
            variables: {
                name,
                projectId,
                startDate: new Date().toISOString().split('T')[0],
                endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                goal: 'Sprint Goal'
            }
        });
    };

    const moveToSprint = (taskId: string, sprintId: string) => {
        updateTask({ variables: { id: taskId, sprintId, status: 'TODO' } });
    };

    return (
        <div className="main-content">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 style={{ fontSize: '26px', fontWeight: 800 }}>Sprints & Backlog</h2>
                    <p className="text-muted">Plan and manage your team's velocity.</p>
                </div>
                <button className="btn-primary" onClick={handleCreateSprint}>
                    <Plus size={18} /> New Sprint
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '32px' }}>
                <div className="flex-col gap-8">
                    {/* Active/Planned Sprints */}
                    {sprints.map(sprint => (
                        <div key={sprint.id} style={{ background: 'white', borderRadius: '16px', border: '1px solid var(--border-light)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
                            <div style={{ padding: '20px 24px', background: 'var(--bg-subtle)', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div className="flex items-center gap-4">
                                    <div style={{ background: sprint.status === 'ACTIVE' ? 'var(--primary)' : 'var(--text-muted)', color: 'white', padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 800 }}>
                                        {sprint.status}
                                    </div>
                                    <h3 style={{ fontSize: '16px', fontWeight: 700 }}>{sprint.name}</h3>
                                    <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                                        {sprint.startDate} — {sprint.endDate}
                                    </span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-1" style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)' }}>
                                        <BarChart2 size={16} className="text-muted" />
                                        {sprint.tasks?.reduce((acc, t) => acc + (t.estimate || 0), 0) || 0} pts
                                    </div>
                                    {sprint.status === 'PLANNED' && (
                                        <button className="btn-primary" style={{ padding: '6px 12px', fontSize: '13px' }}>
                                            <Play size={14} /> Start
                                        </button>
                                    )}
                                    <button className="icon-btn-ghost"><MoreVertical size={16} /></button>
                                </div>
                            </div>
                            <div style={{ padding: '8px' }}>
                                {sprint.tasks && sprint.tasks.length > 0 ? (
                                    sprint.tasks.map(task => (
                                        <div key={task.id} style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div className="flex items-center gap-3">
                                                <div style={{ width: 18, height: 18, borderRadius: '4px', border: '2px solid var(--border-light)' }} />
                                                <span style={{ fontSize: '14px', fontWeight: 600 }}>{task.title}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className={`badge badge-${task.priority.toLowerCase()}`} style={{ fontSize: '10px' }}>{task.priority}</span>
                                                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', background: 'var(--bg-subtle)', padding: '2px 6px', borderRadius: '4px' }}>
                                                    {task.estimate || 0}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '14px' }}>
                                        No tasks in this sprint. Drag from backlog to add.
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Backlog Panel */}
                <div style={{ background: 'white', borderRadius: '16px', border: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', height: 'fit-content' }}>
                    <div style={{ padding: '20px', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Backlog</h3>
                        <span className="column-count">{backlog.length}</span>
                    </div>
                    <div style={{ padding: '12px', maxHeight: '600px', overflowY: 'auto' }}>
                        {backlog.map(task => (
                            <div key={task.id} style={{ padding: '12px', borderRadius: '12px', border: '1px solid var(--border-light)', marginBottom: '8px', cursor: 'pointer' }}>
                                <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>{task.title}</div>
                                <div className="flex justify-between items-center">
                                    <div className={`badge badge-${task.priority.toLowerCase()}`} style={{ fontSize: '9px', padding: '2px 6px' }}>{task.priority}</div>
                                    <div className="flex items-center gap-2">
                                        <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>{task.estimate || 0} pts</div>
                                        <select
                                            style={{ fontSize: '11px', padding: '2px', borderRadius: '4px' }}
                                            onChange={(e) => moveToSprint(task.id, e.target.value)}
                                            value=""
                                        >
                                            <option value="" disabled>Move to...</option>
                                            {sprints.filter(s => s.status !== 'COMPLETED').map(s => (
                                                <option key={s.id} value={s.id}>{s.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SprintsView;
