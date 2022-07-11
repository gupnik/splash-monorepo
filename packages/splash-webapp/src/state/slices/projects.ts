import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProjectState } from "./project";

interface ProjectsState {
  projects: ProjectState[];
}

const initialState: ProjectsState = {
  projects: [],
}

const reduxSafeSetProjects = (data: any): ProjectState[] => {
  if (!data.data.splashAccount) return [];
  const projects = data.data.splashAccount.projects as any[];
  if (projects.length < 0) return [];
  const projectStates: ProjectState[] = projects.map(project => {
    return {
      uri: project.uri
    };
  });
  return projectStates;
};

const projectsSlice = createSlice({
  name: 'projects',
  initialState: initialState,
  reducers: {
    setProjects: (state, action: PayloadAction<any>) => {
      state.projects = reduxSafeSetProjects(action.payload);
    },
  }
});

export const { setProjects } = projectsSlice.actions;

export default projectsSlice.reducer;