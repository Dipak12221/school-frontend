import "./DeleteModal.css";

function DeleteModal({
    student,
    onCancel,
    onConfirm,
}) {
    return (
        <div className="delete-overlay">
            <div className="delete-modal">
                <h2>Delete Student</h2>
                <p>
                    Are you sure you want to delete
                    <strong> {student.name}</strong> ?
                </p>
                <div className="delete-buttons">
                    <button
                        className="cancel-btn"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                    <button
                        className="delete-btn"
                        onClick={onConfirm}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DeleteModal;