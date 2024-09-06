import React from "react";
import { PrimeReactProvider } from "primereact/api";
import { FormProvider, useForm } from "react-hook-form";
import Form from "@/components/Form";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import PrimeReactConfig from "@/config/primeReact.config";
import { FormArrayProvider } from "@/context/FormArrayContext";
import { CameraProvider } from "@/context/CameraContext";
import useLocalStorage from "@/hooks/useLocalStorage";

function App() {
  let [fieldArray] = useLocalStorage([], "fieldArrayStore");
  const methods = useForm({
    defaultValues: {
      fieldArray,
    },
  });

  return (
    <FormProvider {...methods}>
      <FormArrayProvider name="fieldArray">
        <PrimeReactProvider value={PrimeReactConfig}>
          <CameraProvider>
            <Header />
            <Form />
            <Footer />
          </CameraProvider>
        </PrimeReactProvider>
      </FormArrayProvider>
    </FormProvider>
  );
}

export default App;
