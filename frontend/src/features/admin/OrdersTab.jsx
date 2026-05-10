import React from 'react';

const OrdersTab = ({ orders, setAssignModal }) => {
    return (
        <div className="animate-me">
            <div className="admin-table-wrap">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Style</th>
                            <th>Status</th>
                            <th>Tailor</th>
                            <th>Total</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(orders.length ? orders : [
                            { id: 'FF-2401', style: 'Bridal Deep U', status: 'Unassigned', total: 3500 },
                            { id: 'FF-2405', style: 'Velvet Sweetheart', status: 'Assigned', tailor: 'Master Ramesh', total: 4200 },
                        ]).map(order => (
                            <tr key={order.id}>
                                <td><strong>#{order.id}</strong></td>
                                <td>{order.style || 'Custom Design'}</td>
                                <td><span className={`status-pill ${order.status.toLowerCase()}`}>{order.status}</span></td>
                                <td>{order.tailor || 'Not Assigned'}</td>
                                <td>₹{order.total}</td>
                                <td>
                                    <button className="btn btn-outline btn-sm" onClick={() => setAssignModal(order.id)}>Assign Tailor</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrdersTab;
