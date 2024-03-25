"use client";

import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { Icons } from "@/components/Icons";
import { Button } from "@/components/ui/Button";
import { db, storage } from "@/firebase/config";
import { getCurrentDateTime } from "@/lib/utils";
import { addDoc, collection } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { eventSchema } from "@/lib/validations/event";
import InputMask from 'react-input-mask';

type FormData = z.infer<typeof eventSchema>;

function NewEvent() {
  const categories = ["high", "medium", "low", "flexible", "none"];

  const [imageUpload, setImageUpload] = useState<File | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [, setDate] = useState<string>('');

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value;
    setDate(selectedDate);
  }

  const router = useRouter();

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(eventSchema),
  });

  const handleFileChange = (acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      if (file.type && file.type.startsWith("image/")) {
        // If it's an image file, proceed with further processing
        setImageUpload(file);
        setImageError(null);
      } else {
        // If it's not an image file, show an error or handle accordingly
        console.error("Invalid file type. Please select an image.");
      }
    }
  };

  // for image
  const { getRootProps, getInputProps, isDragActive, acceptedFiles } =
    useDropzone({
      onDrop: handleFileChange,
      multiple: false,
      accept: {
        "image/*": [".jpeg", ".jpg", ".png"],
      },
    });

  const uploadImage = async () => {
    if (!imageUpload) return;

    const imageRef = ref(storage, `events/${imageUpload.name}`);
    await uploadBytes(imageRef, imageUpload);

    const imgUrl = await getDownloadURL(imageRef);

    return imgUrl;
  };
  // for image

  const addEventData: SubmitHandler<FormData> = async (data, e) => {
    e?.preventDefault();
   
    data.event_name = data.event_name.toLowerCase();

    const imgUrl = await uploadImage();

    if (!imgUrl) return setImageError("Please select an image");

    setIsSaving(true); // Disable the button

    const eventWithImage = {
      ...data,
      img_url: imgUrl,
      created_at: getCurrentDateTime(),
    };

    try {
      await toast.promise(
        addDoc(collection(db, "events"), eventWithImage),
        {
          loading: "Added...",
          success: <b>Event added!</b>,
          error: <b>Could not be added, try again</b>,
        }
      );

      router.push('/events');
      
    } catch (error) {
      toast.error("Could not be added, try again");
    } finally {
      setIsSaving(false); // Re-enable the button
    }

    // Resets
    acceptedFiles.length = 0;
    setImageUpload(null);
    router.refresh();
    reset();
  };

  return (
    <>
      <div className="pb-2">
        <h1 className="text-primary dark:text-white text-3xl font-bold pb-1">
          Add event
        </h1>
        <p className="text-base text-gray-600 dark:text-gray-400">
          Add a new event
        </p>
      </div>

      <form
        className="pt-10 flex flex-col w-full max-w-2xl gap-5"
        onSubmit={handleSubmit(addEventData)}
      >
        <div className="flex flex-col">
          <label
            htmlFor="name"
            className="pb-2 font-semibold text-primary dark:text-white"
          >
            Name
          </label>
          <input
            {...register("event_name")}
            className="border dark:text-white p-2 rounded-md outline-none border-input dark:border-secondary dark:bg-secondary placeholder:text-sm md:placeholder:text-base"
            type="text"
            id="name"
            name="event_name"
            placeholder="Type event name here."
          />
          {errors.event_name && (
            <span className="text-sm font-medium text-red-600 mt-1">
              {errors.event_name.message}
            </span>
          )}
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="description"
            className="pb-2 font-semibold text-primary dark:text-white"
          >
            Description
          </label>
          <textarea
            {...register("description")}
            className="border dark:text-white p-2 rounded-md outline-none border-input dark:border-secondary dark:bg-secondary resize-none placeholder:text-sm md:placeholder:text-base"
            name="description"
            id="description"
            placeholder="Type event description here."
            cols={30}
            rows={4}
          ></textarea>
          {errors.description && (
            <span className="text-sm font-medium text-red-600 mt-1">
              {errors.description.message}
            </span>
          )}
        </div>

        <div className="flex w-full gap-5">
          <div className="flex flex-col w-1/2">
            <label
              htmlFor="date"
              className="pb-2 font-semibold text-primary dark:text-white"
            >
              Chose a date
            </label>
              <InputMask 
                {...register("event_date")} 
                mask="99/99/9999" 
                placeholder="MM/DD/YYYY"
                type="text" 
                name="event_date" 
                id="date" 
                onChange={handleDateChange}
                className="border dark:text-white border-input rounded-md px-3 py-2 focus:outline-none focus:ring dark:border-secondary dark:bg-secondary"
              />
            
            {errors.event_date && (
              <span className="text-sm font-medium text-red-600 mt-1">
                Invalid date format. Please use MM/DD/YYYY.
              </span>
            )}
          </div>

          <div className="flex flex-col w-1/2">
            <label
              htmlFor="priority"
              className="pb-2 font-semibold text-primary dark:text-white"
            >
              Priority
            </label>
            <select
              {...register("event_priority")}
              className="border dark:text-white p-2 rounded-md outline-none border-input dark:border-secondary dark:bg-secondary capitalize"
              id="priority"
              name="event_priority"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div
          {...getRootProps()}
          className="border-2 border-dashed border-gray-300 dark:border-secondary rounded-lg p-4 h-72 flex flex-col justify-center items-center cursor-pointer"
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p className="text-center text-gray-500">Drop the image here...</p>
          ) : (
            <>
              <div className="flex flex-col items-center">
                {acceptedFiles.length > 0 && !isDragActive ? (
                  <>
                    <div className="w-36">
                      <Image
                        src={URL.createObjectURL(acceptedFiles[0])}
                        alt="Preview"
                        className="mb-2 rounded-md w-auto"
                        priority
                        width={200}
                        height={200}
                      />
                    </div>
                    <p className="text-center text-gray-500 mb-1">
                      {acceptedFiles[0].name}
                    </p>
                  </>
                ) : (
                  <>
                    <Icons.image className="text-gray-400 dark:text-gray-500 w-8 h-8" />
                    <p className="text-center text-gray-500 pt-2">
                      Drag 'n' drop an image here{" "}
                      <span className="text-center text-gray-800 dark:text-gray-400">
                        or
                      </span>{" "}
                      click in this area
                    </p>
                  </>
                )}
                {/* Display the image error message */}
                {imageError && (
                  <p className="text-lg font-medium text-red-600 mt-1">
                    {imageError}
                  </p>
                )}
              </div>
            </>
          )}
        </div>

        <div className="flex justify-start">
          <Button
            className="disabled:opacity-50 disabled:cursor-default"
            type="submit"
            variant="primary"
            size="sm"
            disabled={isSaving}
          >
            Add Event
          </Button>
        </div>
      </form>
    </>
  );
}

export default NewEvent;
