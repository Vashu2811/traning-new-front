import {
  Button,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";

const Queenbee = () => {
  return (
    <>
      <main className="p-4">
        <div className="bg-[##1A1C1E] pt-20 pb-16 ">
          <div className="container mx-auto px-3 max-w-[1320px]">
            <div className="relative flex items-start justify-start w-full row">
              <div className="grid grid-cols-1">
                <div className="mx-6 mb-12">
                  <h1 className="text-3xl text-[#BDBEBE] mb-8 font-bold text-left">
                    Queenbee Form
                  </h1>
                </div>
                <div className="">
                  <form className="mx-6">
                    <Grid container spacing={3}>
                      <Grid item xs={6}>
                        <InputLabel htmlFor="contractType">
                          Contract Type
                        </InputLabel>
                        <Select id="contractType" fullWidth sx={{ mb: 2 }}>
                          <MenuItem>Select...</MenuItem>
                          <MenuItem value="Fulltime">Full-time</MenuItem>
                          <MenuItem value="Parttime">part-time</MenuItem>
                        </Select>
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          label="Location"
                          name="location"
                          variant="outlined"
                          fullWidth
                          sx={{ mt: 2.5, mb: 2 }}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          label="No of Years of experience"
                          name="experience"
                          variant="outlined"
                          fullWidth
                          sx={{ mb: 2 }}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          label="Pay rate"
                          name="payRate"
                          variant="outlined"
                          fullWidth
                          sx={{ mb: 2 }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          label="Job Title"
                          name="jobTitle"
                          variant="outlined"
                          fullWidth
                          sx={{ mb: 2 }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          label="Job Description"
                          name="payRate"
                          variant="outlined"
                          multiline
                          rows={4}
                          fullWidth
                          sx={{ mb: 2 }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Button
                          type="submit"
                          variant="contained"
                          sx={{
                            background: "#282B2F",
                            color: "#BDBEBE",
                            "&:hover": {
                              background: "#282B2F",
                            },
                          }}
                        >
                          Submit
                        </Button>
                      </Grid>
                    </Grid>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Queenbee;
