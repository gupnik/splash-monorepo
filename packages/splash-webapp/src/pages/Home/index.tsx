import { SplashProjectFactory } from "@splash/sdk";
import { useContractFunction } from "@usedapp/core";
import { Button, Card, CardGroup, CardImg, Row } from "react-bootstrap";
import ProjectCard from "../../components/ProjectCard";
import config from "../../config";
import { useAppSelector } from "../../hooks";

interface HomePageProps {
  
}

const HomePage: React.FC<HomePageProps> = props => {
  const splashProjectContract = new SplashProjectFactory().attach(
    config.addresses.splashProject,
  );

  const projects = useAppSelector(state => state.projects.projects);

  const { send: createProject, state: createProjectState } = useContractFunction(
    splashProjectContract,
    'create',
  );

  return (
    <>
    <Button onClick={() => {
      if (createProjectState.status !== "Mining") { 
        createProject(10)
      }
    }}>{createProjectState.status === "Mining" ? "Mining..." : "Create"} </Button>
    <Row xs={1} md={3}>
      {projects.map((project, indx) => (
        <ProjectCard project={project} key={indx} />
      ))}
    </Row>
    </>
  )
}

export default HomePage;