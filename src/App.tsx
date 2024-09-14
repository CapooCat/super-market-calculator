import { PrimeReactProvider } from "primereact/api";
import { ConfirmPopup } from "primereact/confirmpopup";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";

import Footer from "@/components/Footer";
import Form from "@/components/Form";
import Header from "@/components/Header";
import PrimeReactConfig from "@/config/primeReact.config";
import { CameraProvider } from "@/context/CameraContext";
import { FormArrayProvider } from "@/context/FormArrayContext";
import { FormStorageProvider } from "@/context/FormStorageContext";
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
        <FormStorageProvider name="fieldArray" storage="fieldArrayStore">
          <PrimeReactProvider value={PrimeReactConfig}>
            <CameraProvider>
              <Header />
              <Form />
              <Footer />
              <ConfirmPopup
                pt={{
                  rejectButton: { root: () => "border border-[#60a5fa] m-0" },
                }}
              />
            </CameraProvider>
          </PrimeReactProvider>
        </FormStorageProvider>
      </FormArrayProvider>
    </FormProvider>
  );
}

export default App;
