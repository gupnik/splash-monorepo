import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProjectState } from "./project";

export interface ProjectsState {
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
      name: project.name,
      description: project.description,
      image: project.image,
      consumers: project.consumers.map((x: any) => {
        return {
        id: x.project.id,
        price: x.project.price,
        name: x.project.name,
        description: x.project.description,
        image: x.project.image,
      }}),
      constituents: project.constituents.map((x: any) => {
        return {
        id: x.constituent.id,
        price: x.constituent.price,
        name: x.constituent.name,
        description: x.constituent.description,
        image: x.constituent.image,
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
    }
  }
});

export const { setProjects } = projectsSlice.actions;

export default projectsSlice.reducer;