import React from 'react';

const OrdersList = ({ orders, activeTab, setSelectedOrder, STATUS_MAP }) => {
    return (
        <div className="orders-list-tailor">
            {orders.map(order => {
                const statusInfo = STATUS_MAP[order.status] || STATUS_MAP['placed'];
                const daysLeft = Math.ceil((new Date(order.deadline) - new Date()) / (1000 * 60 * 60 * 24));
                return (
                    <div key={order.id} className="tailor-order-card" onClick={() => setSelectedOrder(order)}>
                        <div className="order-thumb">
                            <img src={order.image} alt={order.design} />
                        </div>
                        <div className="order-info">
                            <div className="order-top-row">
                                <span className="order-id">#{order.id}</span>
                                <span className="status-pill" style={{ background: statusInfo.bg, color: statusInfo.color }}>
                                    {statusInfo.label}
                                </span>
                            </div>
                            <h3>{order.design}</h3>
                            <p className="order-customer">👤 {order.customer_name || order.customer}</p>
                            <div className="order-meta-row">
                                <span>🧵 {order.fabric}</span>
                                <span className={`deadline ${daysLeft <= 2 ? 'urgent' : ''}`}>
                                    ⏰ {daysLeft > 0 ? `${daysLeft} days left` : 'Overdue!'}
                                </span>
                            </div>
                            {/* Progress mini bar */}
                            <div className="mini-progress">
                                {order.progress?.map((step, i) => (
                                    <div key={i} className={`mini-dot ${step.done ? 'done' : ''}`} title={step.step}></div>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default OrdersList;
