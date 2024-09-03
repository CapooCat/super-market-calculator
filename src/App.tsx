import React, { useEffect } from "react";
import { PrimeReactProvider } from "primereact/api";
import { FormProvider, useForm } from "react-hook-form";
import Form from "@/components/Form";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import PrimeReactConfig from "@/config/primeReact.config";
import { FormArrayProvider } from "@/context/FormArrayContext";

function App() {
  const methods = useForm({
    defaultValues: {
      fieldArray: [],
    },
  });

  return (
    <FormProvider {...methods}>
      <FormArrayProvider name="fieldArray">
        <PrimeReactProvider value={PrimeReactConfig}>
          <Header />
          <Form />
          <Footer />
        </PrimeReactProvider>
      </FormArrayProvider>
    </FormProvider>
  );
}

export default App;
