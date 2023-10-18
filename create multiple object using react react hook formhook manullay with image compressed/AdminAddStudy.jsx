import { Button, Input, Textarea } from "@material-tailwind/react";

import { useState } from "react";
import { Controller, useFieldArray } from "react-hook-form";
import { useForm } from "react-hook-form";
const AdminAddStudy = () => {
  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "universities",
  });
  const [compressedImages, setCompressedImages] = useState([]);
  // const handleFileUpload = async (event, fieldName) => {
  //   const file = event.target.files[0];
  //   setValue(fieldName, file);
  // };
  // console.log(imageURL);
  // way 1
  const handleFileUpload = async (event, fieldName) => {
    const files = event.target.files;
    console.log("Selected files:", files);
    const compressedImagesArray = [];
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const compressedImage = await compressImage(files[i]);
        compressedImagesArray.push(compressedImage);
      }

      setCompressedImages(compressedImagesArray);
    }
  };

  const compressImage = async (file) => {
    const maxFileSizeInBytes = 300 * 1024; // 400KB
    const qualityStep = 0.05; // Step to reduce quality by

    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;

        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          canvas.width = img.width;
          canvas.height = img.height;

          // Start with a high quality
          let quality = 1.0;

          const tryCompression = () => {
            // Draw image on canvas with the current quality
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);

            // Convert canvas to Blob
            canvas.toBlob(
              (blob) => {
                if (blob.size > maxFileSizeInBytes) {
                  // If the file size is still too large, reduce the quality and try again
                  quality -= qualityStep;
                  tryCompression();
                } else {
                  // File size is within the limit, resolve with the compressed file and its size
                  resolve({
                    file: new File([blob], file.name, { type: "image/jpeg" }),
                    size: blob.size,
                  });
                }
              },
              "image/jpeg",
              quality
            );
          };

          tryCompression();
        };
      };

      reader.readAsDataURL(file);
    });
  };

  const onSubmit = async (data) => {
    // reset();
    console.log(compressedImages);
    console.log(data);
  };
  return (
    <div className="m-7 lg:w-full w-[60%] text-white">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="border rounded-md pb-5">
          <div className="bg-[#607d8b] text-white py-2 mb-10">
            <h3 className="font-bold text-xl tracking-wide pl-5">
              Add Study Information
            </h3>
          </div>

          <div className="mb-7 px-5">
            <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-20">
              <div>
                <label className="mb-2 md:text-lg text-gray-400">
                  Country Name
                </label>
              </div>
              <div>
                <Input
                  type="text"
                  {...register("countryName", { required: true })}
                  size="lg"
                  color="blue"
                  className="border py-2 px-5 text-white
                 rounded w-full max-w-xs lg:max-w-lg xl:max-w-xl 2xl:min-w-full"
                  label="Country Name"
                />
                {errors.countryName && (
                  <p>Country Name is required and must be valid</p>
                )}
              </div>
            </div>
          </div>
          <div className="mb-7 px-5">
            <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-20">
              <div>
                <label className="mb-2 md:text-lg text-gray-400">
                  Country Image (224px*192px)
                </label>
              </div>
              <div>
                <Input
                  type="file"
                  {...register("urlOne", { required: false })}
                  size="lg"
                  color="blue"
                  accept="image/*"
                  onChange={(event) => handleFileUpload(event, "urlOne")}
                  className="border py-2 px-5 
                 rounded w-full max-w-xs lg:max-w-lg xl:max-w-xl 2xl:min-w-full"
                  label="Image"
                />

                {errors.urlOne && <p>Image is required and must be valid</p>}
              </div>
            </div>
          </div>
          <div className="mb-7 px-5">
            <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-20">
              <div>
                <label className="mb-2 md:text-lg text-gray-400">
                  Country Image (1035px*600px)
                </label>
              </div>
              <div>
                <Input
                  type="file"
                  size="lg"
                  color="blue"
                  {...register("urlTwo", { required: false })}
                  onChange={(event) => handleFileUpload(event, "urlTwo")}
                  accept="image/*"
                  className="border py-2 px-5 
                rounded w-full max-w-xs lg:max-w-lg xl:max-w-xl 2xl:min-w-full"
                  label="Country Banner Image"
                />

                {errors.urlTwo && (
                  <p>Country banner Image is required and must be valid</p>
                )}
              </div>
            </div>
          </div>

          <div className="mb-7 px-5">
            <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-20">
              <div>
                <label className="mb-2 md:text-lg text-gray-400">
                  Description
                </label>
              </div>
              <div>
                <Textarea
                  type="text"
                  {...register("countryDetail", { required: true })}
                  size="lg"
                  color="blue"
                  className="border py-2 px-5 
                 rounded w-full max-w-xs lg:max-w-lg xl:max-w-xl 2xl:min-w-full"
                  label="Country Description"
                />
                {errors.countryDetail && (
                  <p>Country Description is required and must be valid</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="border rounded-md mt-10">
          <div className="">
            <div className="bg-[#607d8b] text-white py-2 mb-10">
              <h3 className="font-bold text-xl tracking-wide pl-5">
                Add Universities details
              </h3>
            </div>
          </div>
          {fields.map((field, index) => (
            <div key={field.id}>
              <h4 className="my-5">University {index + 1}</h4>

              <div className=" mb-7 px-5">
                <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-20">
                  <div>
                    <label className="mb-2 md:text-lg  text-gray-400">
                      University Logo
                    </label>
                  </div>
                  <div>
                    <Input
                      type="file"
                      {...register(`universities[${index}].urlLogo`, {
                        required: true,
                      })}
                      size="lg"
                      color="blue"
                      accept=".png,.jpg,.jpeg,.webp"
                      className="border py-2 px-5 

                 rounded w-full max-w-xs lg:max-w-lg xl:max-w-xl 2xl:min-w-full"
                      label=" University Logo "
                    />
                    {errors.urlLogo && (
                      <p>University Logo is required and must be valid</p>
                    )}
                  </div>
                </div>
              </div>
              <div className=" mb-7 px-5">
                <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-20">
                  <div>
                    <label className="mb-2 md:text-lg  text-gray-400">
                      University Name
                    </label>
                  </div>
                  <div>
                    <Input
                      type="text"
                      {...register(`universities[${index}].uniName`, {
                        required: true,
                      })}
                      size="lg"
                      color="blue"
                      className="border py-2 px-5 
                 rounded w-full max-w-xs lg:max-w-lg xl:max-w-xl 2xl:min-w-full"
                      label=" University Name "
                    />
                    {errors.uniName && (
                      <p>University Name is required and must be valid</p>
                    )}
                  </div>
                </div>
              </div>
              <div className=" mb-7 px-5">
                <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-20">
                  <div>
                    <label className="mb-2 md:text-lg  text-gray-400">
                      IELTS SCORE
                    </label>
                  </div>
                  <div>
                    <Input
                      type="number"
                      // step="0.01"
                      {...register(`universities[${index}].ielts`, {
                        required: true,
                      })}
                      size="lg"
                      color="blue"
                      className="border py-2 px-5 
                 rounded w-full max-w-xs lg:max-w-lg xl:max-w-xl 2xl:min-w-full"
                      label="IELTS SCORE "
                    />
                    {errors.ielts && (
                      <p> IELTS SCORE is required and must be valid</p>
                    )}
                  </div>
                </div>
              </div>
              <div className=" mb-7 px-5">
                <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-20">
                  <div>
                    <label className="mb-2 md:text-lg capitalize text-gray-400">
                      program Title
                    </label>
                  </div>
                  <div>
                    <Input
                      type="text"
                      // step="0.01"
                      {...register(`universities[${index}].programTitle`, {
                        required: true,
                      })}
                      size="lg"
                      color="blue"
                      className="border py-2 px-5 
                 rounded w-full max-w-xs lg:max-w-lg xl:max-w-xl 2xl:min-w-full"
                      label="  program Title "
                    />
                    {errors.programTitle && (
                      <p> program Title is required and must be valid</p>
                    )}
                  </div>
                </div>
              </div>
              <div className=" mb-7 px-5">
                <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-20">
                  <div>
                    <label className="mb-2 md:text-lg capitalize text-gray-400">
                      Degree Name
                    </label>
                  </div>
                  <div>
                    <Input
                      type="text"
                      // step="0.01"
                      {...register(`universities[${index}].degree`, {
                        required: true,
                      })}
                      size="lg"
                      color="blue"
                      className="border py-2 px-5 
                 rounded w-full max-w-xs lg:max-w-lg xl:max-w-xl 2xl:min-w-full"
                      label="  Degree Name "
                    />
                    {errors.degree && (
                      <p> program Title is required and must be valid</p>
                    )}
                  </div>
                </div>
              </div>
              <div className=" mb-7 px-5">
                <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-20">
                  <div>
                    <label className="mb-2 md:text-lg capitalize text-gray-400">
                      credit One
                    </label>
                  </div>
                  <div>
                    <Input
                      type="number"
                      // step="0.01"
                      {...register(`universities[${index}].creditOne`, {
                        required: true,
                      })}
                      size="lg"
                      color="blue"
                      className="border py-2 px-5 
                 rounded w-full max-w-xs lg:max-w-lg xl:max-w-xl 2xl:min-w-full"
                      label="   Credit One "
                    />
                    {errors.creditOne && (
                      <p> Credit One is required and must be valid</p>
                    )}
                  </div>
                </div>
              </div>
              <div className=" mb-7 px-5">
                <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-20">
                  <div>
                    <label className="mb-2 md:text-lg capitalize text-gray-400">
                      credit Two
                    </label>
                  </div>
                  <div>
                    <Input
                      type="number"
                      // step="0.01"
                      {...register(`universities[${index}].creditTwo`, {
                        required: true,
                      })}
                      size="lg"
                      color="blue"
                      className="border py-2 px-5 
                 rounded w-full max-w-xs lg:max-w-lg xl:max-w-xl 2xl:min-w-full"
                      label="  Credit Two "
                    />
                    {errors.creditTwo && (
                      <p> Credit Two is required and must be valid</p>
                    )}
                  </div>
                </div>
              </div>
              <div className=" mb-7 px-5">
                <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-20">
                  <div>
                    <label className="mb-2 md:text-lg capitalize text-gray-400">
                      Map Link
                    </label>
                  </div>
                  <div>
                    <Input
                      type="text"
                      // step="0.01"
                      {...register(`universities[${index}].map`, {
                        required: true,
                      })}
                      size="lg"
                      color="blue"
                      className="border py-2 px-5 
                 rounded w-full max-w-xs lg:max-w-lg xl:max-w-xl 2xl:min-w-full"
                      label="  Map Link"
                    />
                    {errors.map && (
                      <p>Map Link is required and must be valid</p>
                    )}
                  </div>
                </div>
              </div>
              <div className=" mb-7 px-5">
                <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-20">
                  <div>
                    <label className="mb-2 md:text-lg capitalize text-gray-400">
                      Varsity Website Link
                    </label>
                  </div>
                  <div>
                    <Input
                      type="text"
                      // step="0.01"
                      {...register(`universities[${index}].moreInfo`, {
                        required: true,
                      })}
                      size="lg"
                      color="blue"
                      className="border py-2 px-5 
                 rounded w-full max-w-xs lg:max-w-lg xl:max-w-xl 2xl:min-w-full"
                      label=" Varsity Website Link"
                    />
                    {errors.moreInfo && (
                      <p>Varsity Website Link is required and must be valid</p>
                    )}
                  </div>
                </div>
              </div>
              <div className=" mb-7 px-5">
                <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-20">
                  <div>
                    <label className="mb-2 md:text-lg  text-gray-400">
                      Admission DeadLine
                    </label>
                  </div>
                  <div>
                    <Input
                      type="date"
                      {...register(`universities[${index}].deadLine`, {
                        required: true,
                      })}
                      size="lg"
                      color="blue"
                      className="border py-2 px-5 
                 rounded w-full max-w-xs lg:max-w-lg xl:max-w-xl 2xl:min-w-full"
                      label=" DeadLine "
                    />
                    {errors.deadLine && (
                      <p>Deadline is required and must be valid</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-end mr-5 my-5">
                <Button
                  className="bg-blue-500"
                  onClick={() =>
                    append({
                      universityName: "", // Add initial values for other properties
                    })
                  }
                >
                  Add University
                </Button>
              </div>
              <div className="text-center">
                <Button className="bg-blue-500" onClick={() => remove(index)}>
                  Remove University
                </Button>
              </div>
            </div>
          ))}
          <Button
            className="bg-blue-500"
            onClick={() =>
              append({
                universityName: "", // Add initial values for other properties
              })
            }
          >
            Add University
          </Button>
        </div>

        <div className="text-center my-5">
          <Button className="bg-blue-500 " type="submit">
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminAddStudy;
