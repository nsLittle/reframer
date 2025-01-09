import Reframer from "../components/Reframer";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-app.firebaseapp.com",
  projectId: "your-project-id",
};

const app = initializeApp(firebaseConfig);

export default function Home() {
  return (
    <>
      <Reframer />
    </>
  );
}