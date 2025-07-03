export type TeamMember = {
  id?: number;
  user_id?: number;
  username?: string;
  email: string;
  phone_number: string;
  first_name: string;
  last_name: string;
  student_id: string;
  date_of_birth: string;
  place_of_birth: string;
  field: string;
  speciality: string;
  is_representative?: boolean;
};

export type ProjectStatus = 'draft' | 'submitted' | 'under_review' | 'sent' | 'processing' | 'directed' | 'rejected';

export type Project = {
  id: number;
  title: string;
  description: string;
  representative: number;
  representative_username: string;
  representative_name?: string;
  representative_email?: string;
  representative_info: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
  };
  status: ProjectStatus;
  directed_to: string | null;
  created_at: string;
  updated_at: string;
  team_members: TeamMember[];
  team_size?: number;
};

export type NewProjectData = {
  title: string;
  description: string;
  team_members: Omit<TeamMember, 'id' | 'user_id' | 'username' | 'is_representative'>[];
};

export type UpdateProjectData = {
  title?: string;
  description?: string;
  status?: ProjectStatus;
};

export type NewTeamMemberData = Omit<TeamMember, 'id' | 'user_id' | 'username' | 'is_representative'>;

export type UpdateTeamMemberData = Partial<NewTeamMemberData>; 