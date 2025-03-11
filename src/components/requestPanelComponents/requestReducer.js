export const initialState = {
    method: "GET",
    url: "",
    params: [{ key: "", value: "" }],
    headers: [
      { key: "Cache-Control", value: "no-cache", checked: false },
      { key: "Accept", value: "*/*", checked: false },
      { key: "User-Agent", value: "Fetch Client", checked: false },
      { key: "Accept-Encoding", value: "gzip, deflate", checked: false },
      { key: "Connection", value: "keep-alive", checked: false },
    ],
    body: "",
    testParam: "",
    testValue: "",
    authType: "NoAuth",
    username: "",
    password: "",
    showPassword: false,
    setVarRows: [{ parameter: "", value: "", variableName: "" }],
    activeSection: "params",
  };
  
  export const requestReducer = (state, action) => {
    switch (action.type) {
      case "SET_METHOD":
        return { ...state, method: action.payload };
      case "SET_URL":
        return { ...state, url: action.payload };
      case "SET_PARAMS":
        return { ...state, params: action.payload };
      case "SET_HEADERS":
        return { ...state, headers: action.payload };
      case "SET_BODY":
        return { ...state, body: action.payload };
      case "SET_AUTH_TYPE":
        return { ...state, authType: action.payload };
      case "SET_USERNAME":
        return { ...state, username: action.payload };
      case "SET_PASSWORD":
        return { ...state, password: action.payload };
      case "TOGGLE_PASSWORD":
        return { ...state, showPassword: !state.showPassword };
      case "SET_TEST_PARAM":
        return { ...state, testParam: action.payload };
      case "SET_TEST_VALUE":
        return { ...state, testValue: action.payload };
      case "SET_SET_VAR_ROWS":
        return { ...state, setVarRows: action.payload };
      case "SET_ACTIVE_SECTION":
        return { ...state, activeSection: action.payload };
      default:
        return state;
    }
  };
  