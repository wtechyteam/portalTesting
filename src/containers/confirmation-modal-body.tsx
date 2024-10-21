import { CONFIRMATION_MODAL_CLOSE_TYPES } from '@/helper/app-constants';
import { useAppDispatch } from '@/lib/hooks';
import { deleteLead } from '@/features/leads/leadSlice';
import { showNotification } from '@/features/common/headerSlice';

interface Props {
    extraObject?: { message?: string; type?: string; index?: number }; // Define the expected shape of extraObject
    closeModal: () => void;
}

function ConfirmationModalBody({ extraObject = {}, closeModal }: Props) {
    const dispatch = useAppDispatch();

    // Destructure with a default value
    const { message = "Are you sure you want to proceed?", type, index } = extraObject;

    const proceedWithYes = async () => {
        // Check if type is for deletion and index is defined
        if (type === CONFIRMATION_MODAL_CLOSE_TYPES.LEAD_DELETE) {
            if (index !== undefined) {
                dispatch(deleteLead({ index })); // Ensure index is defined
                dispatch(showNotification({ message: "Lead Deleted!", status: 1 }));
            } else {
                console.error("Index is undefined, cannot delete lead.");
            }
        }
        closeModal();
    };

    return (
        <>
            <p className='text-xl mt-8 text-center'>
                {message}
            </p>

            <div className="modal-action mt-12">
                <button className="btn btn-outline" onClick={closeModal}>Cancel</button>
                <button className="btn btn-primary w-36" onClick={proceedWithYes}>Yes</button>
            </div>
        </>
    );
}

export default ConfirmationModalBody;
