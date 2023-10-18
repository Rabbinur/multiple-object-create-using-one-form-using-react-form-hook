import { Icon } from "@iconify/react";
import React from "react";
import { useState } from "react";

const AdminCourse = () => {
  // return (
  //   <div className="m-7 lg:w-full w-[60%] text-white">
  //     <h1>course</h1>

  //   </div>
  // );
  const [compressedImagePreview, setCompressedImagePreview] = useState(null);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const compressedImage = await compressImage(file);
      setCompressedImagePreview(URL.createObjectURL(compressedImage));
    }
  };

  const compressImage = async (file) => {
    const maxFileSizeInBytes = 300 * 1024; // 200KB
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

          let quality = 1.0;

          const tryCompression = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);

            canvas.toBlob(
              (blob) => {
                if (blob.size > maxFileSizeInBytes) {
                  quality -= qualityStep;
                  tryCompression();
                } else {
                  resolve(new File([blob], file.name, { type: "image/jpeg" }));
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

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      {compressedImagePreview && (
        <img
          src={compressedImagePreview}
          alt="Compressed"
          style={{ maxWidth: "100%" }}
        />
      )}
    </div>
  );
};

export default AdminCourse;
