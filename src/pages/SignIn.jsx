

import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useCallback, useState } from "react";
// import { setToken } from "@/redux/features/authSlice";
import { yupResolver } from "@hookform/resolvers/yup";
import LoadingButton from "@mui/lab/LoadingButton/LoadingButton";
import { Box, Card, InputLabel, TextField } from "@mui/material";
// import { useAuth } from "contexts/authProvider";
import useAuth from "hooks/useAuth";
import { Controller, useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { login } from "../services/api";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


// import { useRedirectFunctions } from "@propelauth/react";
const SignIn = ({ setLocation }) => {
  // const { redirectToLoginPage, redirectToSignupPage, redirectToAccountPage } =
  //   useRedirectFunctions();

  const { v4: uuidv4 } = require("uuid");
  const { setAuth } = useAuth();
  // Generate a UUIDv4 token
  const generateToken = () => {
    const tokenn = uuidv4();
    return tokenn;
  };
  // Example usage:
  const tokennn = generateToken();
  //   const [loginUser, { data, error, isLoading, isSuccess }] =
  //     useLoginUserMutation();
  const navigate = useNavigate();
  const location = useLocation();
  //   setLocation(location);
  //   const dispatch = useAppDispatch();
  const [isChecked, setIsChecked] = useState(false);
  const validationSchema = yup.object().shape({
    username: yup.string().required("required username"),
    password: yup.string().required("required password"),
  });
  const boxStyle = {
    boxShadow: "0.3px 0.3px 1px rgba(0, 0, 0, 0.16)", // Adjust values as needed
    backgroundColor: "white",
  };
  const defaultValues = {
    username: "",
    password: "",
  };
  const form = useForm({
    defaultValues: defaultValues,
    resolver: yupResolver(validationSchema),
  });
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = form;
  const onSubmit = useCallback(
    async (data, e) => {
      e.preventDefault();
      try {
        // Call the login function from the API service
        const response = await login(data);
        // Assuming the API returns a token upon successful login
        const { token } = response;
        const role = response.user.role;
        const name = response.user.username;
        // setAuth({ role, name });
        // Store authentication details in localStorage
        // localStorage.setItem("auth", JSON.stringify({ role, name }));
        setAuth({ role: `${role}`, name: `${name}` });
        // Store token in localStorage or perform any other necessary actions
        localStorage.setItem("token", token);

        if (role === "user") {
          navigate("/training");
          return;
        }
        if (role === "mentor") {
          navigate("/mentor");
          return;
        }
        navigate("/adminvbee");
        // window.location.href = "/";
      } catch (error) {
        // Handle login failure or error
        toast.error("Something Went Wrong, Please Try Again.", {
          autoClose: 3000,
        });
        
      }
    },
    [location.pathname]
  );
  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };
  return (
    <>
    <ToastContainer />

    <Box className="flex justify-center signin-section">
      <Box component="main" className="main">
        <Box
          component="div"
          className="p-10 flex flex-col justify-center items-center"
        >
          <Box className="flex items-center">
            <Typography
              variant="h1"
              sx={{ fontWeight: 700 }}
              className="text-[#5B53E7] text-center text-8xl leading-normal"
            >
              Hcombai
            </Typography>
          </Box>
          <Card
            className="w-[730px] max-sm:w-fit px-5 max-w-full h-[500px] mt-16 flex flex-col items-center justify-center border border-[E1E3EA] rounded-xl"
            style={boxStyle}
          >
            <Typography
              component="h1"
              variant="h5"
              sx={{
                color: "#181C32",
                fontSize: "24px",
                textAlign: "center",
                fontWeight: 600,
                letterSpacing: "-0.24px",
                marginBottom: "35px",
              }}
            >
              Sign In For An Account
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <InputLabel
                    sx={{ color: "#181C32", fontWeight: 600, fontSize: "14px" }}
                  >
                    User Name
                  </InputLabel>
                  <Controller
                    name={"username"}
                    control={control}
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                      formState,
                    }) => (
                      <TextField
                        helperText={error ? error.message : null}
                        size="small"
                        type={"text"}
                        autoComplete="off"
                        error={!!error}
                        onChange={onChange}
                        value={value}
                        placeholder={"Enter User Name"}
                        fullWidth
                        variant="outlined"
                        inputProps={{
                          style: {
                            borderRadius: "5px",
                            border: "1px solid #E1E3EA",
                            color: "#7E8299",
                            fontSize: "14px",
                            fontWeight: 600,
                            padding: "13px 12px",
                          },
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <InputLabel
                    sx={{ color: "#181C32", fontWeight: 600, fontSize: "14px" }}
                  >
                    Password
                  </InputLabel>
                  <Controller
                    name={"password"}
                    control={control}
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                      formState,
                    }) => (
                      <TextField
                        helperText={error ? error.message : null}
                        size="small"
                        type={"password"}
                        autoComplete="off"
                        error={!!error}
                        onChange={onChange}
                        value={value}
                        placeholder={"Enter Password"}
                        fullWidth
                        variant="outlined"
                        inputProps={{
                          style: {
                            borderRadius: "5px",
                            border: "1px solid #E1E3EA",
                            color: "#7E8299",
                            fontSize: "14px",
                            fontWeight: 600,
                            padding: "13px 12px",
                          },
                        }}
                      />
                    )}
                  />
                </Grid>
                {/* <Box sx={{ display: "flex", margin: "20px 13px 0" }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={isChecked}
                        onChange={handleCheckboxChange}
                        id="accept-terms"
                      />
                    }
                    label="I Accept the Terms & Conditions"
                    htmlFor="accept-terms"
                    sx={{ color: "#181C32", fontWeight: 600, fontSize: "14px" }}
                  />
                </Box> */}
              </Grid>
              <LoadingButton
                size="large"
                type="submit"
                color="primary"
                fullWidth
                variant="contained"
                sx={{
                  my: 2,
                  padding: "16px 24px",
                  backgroundColor: "#5B53E7",
                  fontSize: "16px",
                  fontWeight: 600,
                  textTransform: "none",
                  borderRadius: "6px",
                  "&:hover": {
                    background: "#5B53E7",
                  },
                }}
              >
                Sign In
              </LoadingButton>

              {/* <button
                onClick={() =>
                  redirectToLoginPage({
                    postLoginRedirectUrl: "http://localhost:3000/admin",
                  })
                }
              >
                Login
              </button> */}

              {/* <Grid container justifyContent="center">
                <Grid item sx={{ display: "flex", gap: "5px" }}>
                  Already have an Account?
                  <Link
                    to="/signup"
                    style={{
                      textDecoration: "none",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "#023E8A",
                      }}
                    >
                      Sign up
                    </Typography>
                  </Link>
                </Grid>
              </Grid> */}
            </form>
          </Card>
        </Box>
      </Box>
    </Box>
    </>

  );
};
export default SignIn;
