import React, { useState, useEffect, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { TextField, Button, Box, Typography, Autocomplete, CircularProgress, Grid, IconButton } from '@mui/material';
import {fetchCities, fetchDistricts, fetchPackages, fetchProducts, submitDrop} from "./api.js";
import {authorization} from "./authorization.js";

const App = () => {
  const { control, handleSubmit, setValue } = useForm();
  const [cities, setCities] = useState([]);
  const [products, setProducts] = useState({});
  const [districts, setDistricts] = useState([]);
  const [packages, setPackages] = useState([]);
  const [districtsLoading, setDistrictsLoading] = useState(false);
  const [packagesLoading, setPackagesLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const fileInputRef = useRef();

  const [isAuth, setIsAuth] = useState(false)

  useEffect(() => {
    if(process.env.REACT_APP_ENV === 'local'){
      setIsAuth(true)
    }else{
      authorization.init().then((data) => {
        if(data.result){
          setIsAuth(true)
        }
      })
    }

  }, [])

  useEffect(() => {
    if(isAuth){
      fetchCities().then(setCities).catch((error) => console.error(error));
      fetchProducts().then(setProducts).catch((error) => console.error(error));
    }
  }, [isAuth]);

  const onSubmit = async (data) => {
    if (selectedFiles.length === 0) {
      setErrorMessage('Ошибка: добавьте файлы');
      setSuccessMessage('');
      return;
    }

    const dropData = {
      cityId: data.city.id,
      districtId: data.district.id,
      packageId: data.package.id,
      comment: data.comment
    };

    const formData = new FormData();
    formData.append('drop', JSON.stringify(dropData));

    selectedFiles.forEach(file => {
      formData.append('photos', file);
    });

    const result = await submitDrop(formData)

    if(result.success){
      setSuccessMessage('Успех');

      setTimeout(() => {
        setSuccessMessage('');
      }, 4000)

      setErrorMessage('');
      setValue('comment', '');
      setSelectedFiles([]);
      fileInputRef.current.value = null;
    }else{
      setErrorMessage(result.error || 'Ошибка');
      setTimeout(() => {
        setErrorMessage("")
      }, 4000)
      setSuccessMessage('');
    }

  };

  const handleFileChange = (e) => {
    setSelectedFiles([...e.target.files]);
  };

  const handleFileRemove = (index) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updatedFiles);
    fileInputRef.current.value = null;
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ maxWidth: 600, margin: 'auto', padding: 2, bgColor: "fff" }}>
      <Grid container spacing={2}>

        {/*{isAuth ? "AUTH" : "NOT AUTH"}*/}

        <Grid item xs={12}>
          <Controller
              name="city"
              control={control}
              render={({ field }) => (
                  <Autocomplete
                      {...field}
                      options={cities}
                      getOptionLabel={(option) => option.name || ''}
                      renderInput={(params) => <TextField {...params} label="Выбери город" />}
                      value={field.value || null}
                      onChange={(_, data) => {
                        field.onChange(data);
                        setDistrictsLoading(true);
                        fetchDistricts(data.id).then((districts) => {
                          setDistricts(districts);
                          setDistrictsLoading(false);
                        }).catch((error) => {
                          console.error(error);
                          setDistrictsLoading(false);
                        });
                      }}
                  />
              )}
          />
        </Grid>
        <Grid item xs={12}>
          {districtsLoading ? <CircularProgress /> : (
              <Controller
                  name="district"
                  control={control}
                  render={({ field }) => (
                      <Autocomplete
                          {...field}
                          options={districts}
                          getOptionLabel={(option) => option.district || ''}
                          renderInput={(params) => <TextField {...params} label="Выбери район" />}
                          value={field.value || null}
                          onChange={(_, data) => field.onChange(data)}
                      />
                  )}
              />
          )}
        </Grid>
        <Grid item xs={12}>
          <Controller
              name="product"
              control={control}
              render={({ field }) => (
                  <Autocomplete
                      {...field}
                      options={Object.keys(products).map(key => ({ id: key, ...products[key] }))}
                      getOptionLabel={(option) => option.short_description || ''}
                      renderInput={(params) => <TextField {...params} label="Выбери продукт" />}
                      value={field.value || null}
                      onChange={(_, data) => {
                        field.onChange(data);
                        setPackagesLoading(true);
                        fetchPackages(data.id).then((packages) => {
                          setPackages(packages);
                          setPackagesLoading(false);
                        }).catch((error) => {
                          console.error(error);
                          setPackagesLoading(false);
                        });
                      }}
                  />
              )}
          />
        </Grid>
        <Grid item xs={12}>
          {packagesLoading ? <CircularProgress /> : (
              <Controller
                  name="package"
                  control={control}
                  render={({ field }) => (
                      <Autocomplete
                          {...field}
                          options={packages}
                          getOptionLabel={(option) => option.name || option.quantity.toString() || ''}
                          renderInput={(params) => <TextField {...params} label="Выбери package" />}
                          value={field.value || null}
                          onChange={(_, data) => field.onChange(data)}
                      />
                  )}
              />
          )}
        </Grid>
        <Grid item xs={12}>
          <Controller
              name="comment"
              control={control}
              render={({ field }) => (
                  <TextField
                      {...field}
                      label="Введи комментарий"
                      multiline
                      rows={3}
                      fullWidth
                  />
              )}
          />
        </Grid>
        <Grid item xs={12}>
          <input
              type="file"
              multiple
              onChange={handleFileChange}
              ref={fileInputRef}
          />
          <Grid container spacing={1}>
            {selectedFiles.map((file, index) => (
                <Grid item key={index}>
                  <Typography variant="body2">
                    {file.name}
                    <IconButton size="small" onClick={() => handleFileRemove(index)}>
                      x
                    </IconButton>
                  </Typography>
                </Grid>
            ))}
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Отправить
          </Button>
        </Grid>
        {successMessage && (
            <Grid item xs={12}>
              <Typography color="green">{successMessage}</Typography>
            </Grid>
        )}
        {errorMessage && (
            <Grid item xs={12}>
              <Typography color="red">{errorMessage}</Typography>
            </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default App;

