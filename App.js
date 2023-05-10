import * as React from "react";
import MainContainer from "./navigation/MainContainer";
import Toast from "react-native-toast-message";
import { toastConfig } from "./components/Toast";

export default function App() {
  return (
    <>
      <MainContainer></MainContainer>
      <Toast config={toastConfig} ref={(ref) => {}} />
    </>
  );
}
