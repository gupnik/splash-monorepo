import { SplashProjectFactory } from "@splash/sdk";
import { useContractFunction } from "@usedapp/core";
import { Button } from "react-bootstrap";
import config from "../../config";

interface HomePageProps {
  
}

const HomePage: React.FC<HomePageProps> = props => {
  const splashProjectContract = new SplashProjectFactory().attach(
    config.addresses.splashProject,
  );

  const { send: createProject, state: createProjectState } = useContractFunction(
    splashProjectContract,
    'create',
  );

  return (
    <>
    <Button onClick={() => {
      createProject(10)
    }}>Create</Button>
    </>
  )
}

export default HomePage;