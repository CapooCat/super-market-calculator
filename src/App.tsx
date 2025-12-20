import { PrimeReactProvider } from "primereact/api";
import { ConfirmPopup } from "primereact/confirmpopup";
import React, { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";

import ExtractionStatusToast from "./components/ExtractionStatusBadge";
import Loading from "./components/Loading";
import Footer from "@/components/Footer";
import Form from "@/components/Form";
import Header from "@/components/Header";
import PrimeReactConfig from "@/config/primeReact.config";
import { CameraProvider } from "@/context/CameraContext";
import { FormArrayProvider } from "@/context/FormArrayContext";
import { FormStorageProvider } from "@/context/FormStorageContext";
import { GeminiProvider } from "@/context/GeminiContext";
import useIndexedDB from "@/hooks/useIndexedDB";

function App() {
  const [fieldArray, , isLoading] = useIndexedDB([], "fieldArrayStore");
  const methods = useForm({
    defaultValues: {
      fieldArray,
    },
  });

  // Update form when IndexedDB data loads
  useEffect(() => {
    if (!isLoading) {
      methods.reset({ fieldArray });
    }
  }, [fieldArray, isLoading, methods]);

  if (isLoading) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <FormArrayProvider name="fieldArray">
        <FormStorageProvider name="fieldArray" storage="fieldArrayStore">
          <PrimeReactProvider value={PrimeReactConfig}>
            <GeminiProvider>
              <CameraProvider>
                <ExtractionStatusToast />
                <Header />
                <Form />
                <Footer />
                <ConfirmPopup
                  pt={{
                    rejectButton: { root: () => "border border-primary m-0" },
                  }}
                />
              </CameraProvider>
            </GeminiProvider>
          </PrimeReactProvider>
        </FormStorageProvider>
      </FormArrayProvider>
    </FormProvider>
  );
}

export default App;
