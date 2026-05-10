import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_AUDIT_LOGS } from '../graphql/operations';
import { Clock, Zap, Edit3, Trash2, Plus } from 'lucide-react';

interface TaskActivityFeedProps {
  taskId: string;
}

const TaskActivityFeed: React.FC<TaskActivityFeedProps> = ({ taskId }) => {
  const { data, loading } = useQuery(GET_AUDIT_LOGS, {
    variables: { entityType: 'TASK', entityId: taskId },
  });

  const logs = data?.auditLogs || [];

  if (loading) return <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading history...</div>;

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'CREATE': return <Plus size={14} />;
      case 'UPDATE': return <Edit3 size={14} />;
      case 'DELETE': return <Trash2 size={14} />;
      default: return <Zap size={14} />;
    }
  };

  const formatActionMessage = (log: any) => {
    switch (log.action) {
      case 'CREATE': return `created this task`;
      case 'UPDATE':
        try {
          const prev = JSON.parse(log.previousData || '{}');
          const next = JSON.parse(log.newData || '{}');
          if (prev.status !== next.status) return `changed status to ${next.status}`;
          if (prev.priority !== next.priority) return `changed priority to ${next.priority}`;
          return `updated task details`;
        } catch {
          return `updated this task`;
        }
      case 'DELETE': return `deleted this task`;
      default: return `performed ${log.action} on this task`;
    }
  };

  return (
    <div style={{ marginTop: '24px' }}>
      <h4 style={{ fontSize: '14px', fontWeight: 800, marginBottom: '16px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Clock size={16} /> Activity History
      </h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingLeft: '8px' }}>
        {logs.map((log: any, index: number) => (
          <div key={log.id} style={{ display: 'flex', gap: '16px', position: 'relative' }}>
            {index !== logs.length - 1 && (
              <div style={{ position: 'absolute', left: '15px', top: '30px', bottom: '-10px', width: '2px', background: 'var(--border-light)' }} />
            )}
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%', background: 'var(--bg-subtle)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              zIndex: 1, border: '2px solid white'
            }}>
              {getActionIcon(log.action)}
            </div>
            <div style={{ paddingTop: '4px' }}>
              <p style={{ fontSize: '13px', color: 'var(--text-main)', fontWeight: 500 }}>
                <span style={{ fontWeight: 800 }}>{log.userId.split('|')[1] || log.userId}</span> {formatActionMessage(log)}
              </p>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, marginTop: '2px' }}>
                {new Date(parseInt(log.createdAt)).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
        {logs.length === 0 && (
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center', padding: '20px' }}>
            No activity recorded yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default TaskActivityFeed;
