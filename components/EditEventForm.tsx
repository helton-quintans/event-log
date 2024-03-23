"use client";

import { Event } from "@/types";
import { Button } from "./ui/Button";
import { Icons } from "./Icons";
import Image from "next/image";
import { useEffect, useState } from "react";
import { db, storage } from "@/firebase/config";
import { doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { getCurrentDateTime } from "@/lib/utils";
import { useDropzone } from "react-dropzone";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { eventSchema } from "@/lib/validations/event";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import InputMask from 'react-input-mask';

type FormData = z.infer<typeof eventSchema>;

function EditEventForm({ item, id }: { item: Event; id: string }) {
  const categories = ["high", "medium", "low", "flexible", "none"];

  const [imageUpload, setImageUpload] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(eventSchema),
  });

  useEffect(() => {
    setValue("event_name", item.event_name);
    setValue("description", item.description);
    setValue("event_priority", item.event_priority);
    setValue("event_date", item.event_date || '');
  }, [item, setValue]);

 
  const handleFileChange = (acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      if (file.type && file.type.startsWith("image/")) {
        // If it's an image file, proceed with further processing
        setImageUpload(file);
      } else {
        // If it's not an image file, show an error or handle accordingly
        console.error("Invalid file type. Please select an image.");
      }
    }
  };

  // dropzone
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

  const updateEventData: SubmitHandler<FormData> = async (data, e) => {
    e?.preventDefault();

    data.event_name = data.event_name.toLowerCase();

    const imgUrl = await uploadImage();

    if (!imgUrl) return toast.error("Update image or select same image");

    setIsSaving(true); // Disable the button

    const eventWithImage = {
      ...data,
      img_url: imgUrl,
      created_at: getCurrentDateTime(),
    };

    const eventRef = doc(db, "events", id);
    try {
      await toast.promise(updateDoc(eventRef, eventWithImage), {
        loading: "Updated...",
        success: <b>Event updated!</b>,
        error: <b>Could not be updated. Try again.</b>,
      });

      
    } catch (error) {
      toast.error("Could not be updated. Try again.");
    } finally {
      setIsSaving(false); // Re-enable the button
    }
    
    router.refresh();
  };

  return (
    <>
      <form
        className="pt-10 flex flex-col w-full max-w-2xl gap-5"
        onSubmit={handleSubmit(updateEventData)}
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
            className="border p-2 text-primary dark:text-white  dark:bg-secondary rounded-md outline-none border-input dark:border-secondary placeholder:text-sm md:placeholder:text-base"
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
            className="border p-2 text-primary dark:text-white  dark:bg-secondary rounded-md outline-none border-input dark:border-secondary resize-none placeholder:text-sm md:placeholder:text-base"
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
                placeholder="dd/mm/yyyy"
                type="text" 
                name="event_date" 
                id="date" 
                className="border dark:text-white border-input rounded-md px-3 py-2 focus:outline-none focus:ring dark:border-secondary dark:bg-secondary"
              />
            
            {errors.event_date && (
              <span className="text-sm font-medium text-red-600 mt-1">
                Must be a valid date
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
              className="border p-2 text-primary dark:text-white  dark:bg-secondary rounded-md outline-none border-input dark:border-secondary capitalize"
              id="priority"
              name="event_priority"
            >
              {categories.map((priority) => (
                <option key={priority} value={priority}>
                  {priority}
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
                        alt={item.event_name}
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
                    {item.img_url ? (
                      <div className="w-36">
                        <Image
                          src={item.img_url}
                          alt={item.event_name}
                          className="w-auto mb-2 rounded-md"
                          priority
                          width={200}
                          height={200}
                        />
                      </div>
                    ) : (
                      <>
                        <Icons.image className="text-gray-400 w-8 h-8" />
                        <p className="text-center text-gray-500 pt-2">
                          Drag 'n' drop an image here{" "}
                          <span className="text-center text-gray-800">or</span>{" "}
                          click in this area
                        </p>
                      </>
                    )}
                  </>
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
            Update Event
          </Button>
        </div>
      </form>
    </>
  );
}

export default EditEventForm;
