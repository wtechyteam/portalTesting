"use client";
import moment from "moment";
import { useEffect } from "react";
import { useRouter } from 'next/navigation'; // Use next/navigation in Next.js 13 and later
import TrashIcon from '@heroicons/react/24/outline/TrashIcon';
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { getUsers, deleteUser } from "./../common/userSlice"; // Import the getUsers thunk
import { CONFIRMATION_MODAL_CLOSE_TYPES, MODAL_BODY_TYPES } from "@/helper/app-constants";
import TitleCard from "@/components/cards/title-card";
import { openModal } from "../common/modalSlice";
import { Lead, UserProfile } from "@/helper/types"; // Import your types

const TopSideButtons = () => {
    const dispatch = useAppDispatch();

    const openAddNewLeadModal = () => {
        dispatch(openModal({ title: "Add New Lead", bodyType: MODAL_BODY_TYPES.LEAD_ADD_NEW }));
    };

    return (
        <div className="inline-block float-right">
            <button className="btn px-6 btn-sm normal-case btn-primary" onClick={openAddNewLeadModal}>Add New</button>
        </div>
    );
};

function Leads() {
    const dispatch = useAppDispatch();
    const router = useRouter(); // Initialize the router for redirection
    const { leads } = useAppSelector((state) => state.user); // Assuming leads are stored in the user slice
    const user = useAppSelector((state) => state.user); // Assuming your user state contains role information

    // Check if the user is logged in as admin
    useEffect(() => {
        // Redirect to an unauthorized page if user is not an admin
        if (user.role !== 'admin') { // Replace 'admin' with your admin role constant if needed
            router.push('/unauthorized'); // Redirect to an unauthorized page or wherever you want
        } else {
            dispatch(getUsers()); // Fetch the users (leads)
        }
    }, [user.role, dispatch, router]); // Add necessary dependencies

    const deleteCurrentLead = (index: number, userId: string) => {
        dispatch(openModal({
            title: "Confirmation",
            bodyType: MODAL_BODY_TYPES.CONFIRMATION, 
            extraObject: { 
                message: `Are you sure you want to delete this lead?`, 
                type: CONFIRMATION_MODAL_CLOSE_TYPES.LEAD_DELETE, 
                index: index, 
                userId: userId // Pass userId (using the correct field name)
            }
        }));
    }

    return (
        <>
            <TitleCard title="Current Users" topMargin="mt-2" TopSideButtons={<TopSideButtons />}>
                <div className="overflow-x-auto w-full">
                    <table className="table w-full">
                        <thead>
                            <tr>
                                <th>Name</th>
                                {/* <th>Email Id</th> */}
                                <th>Role</th> {/* Added Role header */}
                                <th></th> {/* For delete button */}
                            </tr>
                        </thead>
                        <tbody>
                            {leads.map((l: UserProfile, k: number) => (  // Change Lead to UserProfile
                                <tr key={k}>
                                    <td>
                                        <div className="flex items-center space-x-3">
                                            {/* Uncomment and use avatar if needed */}
                                            {/* <div className="avatar">
                                                <div className="mask mask-squircle w-12 h-12">
                                                    <img src={l.avatar} alt="Avatar" />
                                                </div>
                                            </div> */}
                                            <div>
                                                <div className="font-bold">{l.name}</div> {/* Combined first and last name */}
                                            </div>
                                        </div>
                                    </td>
                                    {/* <td>{l.emailId}</td> Make sure email exists in UserProfile */}
                                    <td>{l.role}</td> {/* Assuming 'role' is a property of UserProfile */}
                                    {/* <td>
                                        {l.id ? ( // Ensure id is defined before allowing deletion
                                            <button className="btn btn-square btn-ghost" onClick={() => deleteCurrentLead(k, l.id as string)}>
                                                <TrashIcon className="w-5" />
                                            </button>
                                        ) : (
                                            <span>No ID</span> // Handle the case where id is undefined
                                        )}
                                    </td> */}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </TitleCard>
        </>
    );
}

export default Leads;
