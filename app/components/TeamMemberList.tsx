import React from 'react';
import type { TeamMember } from '../types/project';
import { FaUserEdit, FaUserMinus, FaUserCheck } from 'react-icons/fa';

// Props interface for the TeamMemberList component
interface TeamMemberListProps {
  members: TeamMember[];
  onEdit: (member: TeamMember) => void;
  onDelete: (memberId: number) => void;
  isEditable: boolean;
}

/**
 * Component to display a list of team members
 * Includes options to edit and delete members (if project is in draft state)
 */
function TeamMemberList({ members, onEdit, onDelete, isEditable }: TeamMemberListProps) {
  return (
    <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 dark:text-gray-500 flex items-center">
        Team Members <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">({members.length}/6)</span>
      </h2>
      
      {members.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No team members added yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Contact
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Student ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Field / Speciality
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                {isEditable && (
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
              {members.map((member) => (
                <tr key={member.id || member.email} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-500">
                      {member.first_name} {member.last_name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Born: {new Date(member.date_of_birth).toLocaleDateString()} in {member.place_of_birth}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-gray-500">{member.email}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{member.phone_number}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-500">
                    {member.student_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-gray-500">{member.field}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{member.speciality}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {member.is_representative ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        <FaUserCheck className="mr-1" /> Representative
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        Member
                      </span>
                    )}
                  </td>
                  
                  {isEditable && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {!member.is_representative && (
                        <>
                          <button
                            onClick={() => onEdit(member)}
                            className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-200 mr-4"
                            title="Edit Member"
                          >
                            <FaUserEdit className="inline-block" />
                          </button>
                          
                          <button
                            onClick={() => member.id && onDelete(member.id)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200"
                            title="Remove Member"
                          >
                            <FaUserMinus className="inline-block" />
                          </button>
                        </>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default TeamMemberList; 