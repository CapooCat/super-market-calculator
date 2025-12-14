const PrimeReactConfig: object = {
  ripple: true,

  pt: {
    inputtext: {
      root: "w-full p-2 h-fit text-white",
    },
    inputnumber: {
      root: "w-full h-fit text-white",
    },
    dialog: {
      root: "w-full m-0 rounded-tr-3xl rounded-tl-3xl",
      header: "rounded-tr-3xl rounded-tl-3xl",
      footer: "flex flex-col-reverse flex-col gap-2",
    },
    button: {
      root: "!p-2",
    },
    tag: {
      root: "p-0 px-2 text-sm w-fit font-normal line-clamp-1",
    },
    confirmpopup: {
      root: "w-[220px] !left-auto right-2",
      content: "p-4 max-w-[90vw] text-center justify-center",
      footer: "p-4 pt-0 flex flex-col flex-col-reverse gap-2 ",
      message: "m-0",
    },
    accordion: {
      root: "flex flex-col gap-2",
    },
    accordiontab: {
      root: "bg-black/20 overflow-hidden rounded-3xl",
      header: "bg-transparent",
      headerAction:
        "p-4 bg-transparent hover:bg-black/20 transition-colors rounded-tl-3xl rounded-t-3xl !border-b-0 box-border",
      toggleableContent: "bg-transparent !border-t border-gray-700",
      content: "p-3 pt-0 bg-transparent rounded-bl-3xl  rounded-br-3xl",
    },
  },
};

export default PrimeReactConfig;
