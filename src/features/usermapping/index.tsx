"use client";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { getUsers } from "./../common/userSlice"; // Import your user actions
import { mapUserRelationships } from "./../common/userRelationshipSlice";
import { UserProfile } from "@/helper/types"; // Import your User type
import { User } from '@/helper/types';

const UserMapping: React.FC = () => {
    const dispatch = useAppDispatch();
    const { leads } = useAppSelector((state) => state.user);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [supervisors, setSupervisors] = useState<string[]>([]);
    const [peers, setPeers] = useState<string[]>([]);
    const [juniors, setJuniors] = useState<string[]>([]);

    useEffect(() => {
        dispatch(getUsers()); // Fetch users when the component mounts
    }, [dispatch]);

    const handleSubmit = () => {
        if (selectedUser) {
            const mappingData = {
                userId: selectedUser._id,  // Make sure you're consistent with _id or id
                supervisors,
                peers,
                juniors,
            };

            dispatch(mapUserRelationships(mappingData)); // Dispatch the mapping action
        }
    };

    return (
        <div className="p-4 bg-white rounded shadow-md">
            <h2 className="text-lg font-semibold mb-4">Map User Relationships</h2>
            
            <div className="mb-4">
                <label className="block mb-1">Select User:</label>
                <select 
                    value={selectedUser ? selectedUser._id : ''}  // Ensure consistency with _id or id
                    onChange={(e) => setSelectedUser(leads.find(user => user._id === e.target.value) || null)}
                    className="select select-bordered w-full"
                >
                    <option value="" disabled>Select a user</option>
                    {leads.map((user: UserProfile) => (
                        <option key={user._id} value={user._id}>{user.name}</option> // Use _id if it's what you're getting from the backend
                    ))}
                </select>
            </div>

            {selectedUser && (
                <>
                    <div className="mb-4">
                        <label className="block mb-1">Supervisors:</label>
                        <select 
                            multiple 
                            value={supervisors}
                            onChange={(e) => setSupervisors(Array.from(e.target.selectedOptions, option => option.value))}  // Fix the iteration issue
                            className="select select-bordered w-full"
                        >
                            {leads.map((user: UserProfile) => (
                                <option key={user._id} value={user._id}>{user.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block mb-1">Peers:</label>
                        <select 
                            multiple 
                            value={peers}
                            onChange={(e) => setPeers(Array.from(e.target.selectedOptions, option => option.value))}  // Fix the iteration issue
                            className="select select-bordered w-full"
                        >
                            {leads.map((user: UserProfile) => (
                                <option key={user._id} value={user._id}>{user.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block mb-1">Juniors:</label>
                        <select 
                            multiple 
                            value={juniors}
                            onChange={(e) => setJuniors(Array.from(e.target.selectedOptions, option => option.value))}  // Fix the iteration issue
                            className="select select-bordered w-full"
                        >
                            {leads.map((user: UserProfile) => (
                                <option key={user._id} value={user._id}>{user.name}</option>
                            ))}
                        </select>
                    </div>

                    <button 
                        className="btn btn-primary"
                        onClick={handleSubmit}
                    >
                        Save Mapping
                    </button>
                </>
            )}
        </div>
    );
};

export default UserMapping;
