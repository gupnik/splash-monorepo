import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProjectState } from "./project";

interface ProjectsState {
  projects:  { [id: string]: ProjectState};
}

const initialState: ProjectsState = {
  projects: {},
}

const reduxSafeSetProjects = (data: any): ProjectsState => {
  if (!data.data.splashAccount) return { projects: {} };
  const projects = data.data.splashAccount.projects as any[];
  if (projects.length < 0) return { projects: {} };
  let state: ProjectsState = { projects: {} };
  projects.forEach(project => {
    state.projects[project.id] = {
      id: project.id,
      uri: project.uri,
      price: project.price,
      data: {},
      constituents: project.constituents.map((x: any) => {
        return {
        id: x.id,
        uri: x.uri,
        price: x.price,
        data: {},
      }})
    };
  });
  return state;
};

const projectsSlice = createSlice({
  name: 'projects',
  initialState: initialState,
  reducers: {
    setProjects: (state, action: PayloadAction<any>) => {
      state.projects = reduxSafeSetProjects(action.payload).projects;
    },
    setProjectData: (state, action: PayloadAction<{ id: string, data: any }>) => {
      state.projects[action.payload.id].data = action.payload.data;
    }
  }
});

export const { setProjects, setProjectData } = projectsSlice.actions;

export default projectsSlice.reducer;