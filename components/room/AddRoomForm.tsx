"use client";
import { IHotel, IRoom } from "@/models/Hotel";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";
import React from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import axios from "axios";
import { Circle, Loader2, Pencil, PencilLine } from "lucide-react";
import { UploadButton } from "../uploadthing";
import { useRouter } from "next/navigation";

interface AddRoomFormProps {
  hotel?: IHotel & {
    rooms: IRoom[];
  };
  room?: IRoom;
  handleDialogueOpen: () => void;
}

const formSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters long" }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 3 characters long" }),
  bedCount: z.coerce
    .number()
    .min(1, { message: "Bed Count count is Required" }),
  guestCount: z.coerce
    .number()
    .min(1, { message: "Guest Count count is Required" }),
  bathroomCount: z.coerce
    .number()
    .min(1, { message: "Bathroom Count count is Required" }),
  kingBed: z.coerce.number().min(0),
  queenBed: z.coerce.number().min(0),
  image: z.string().min(1, { message: "Image is required" }),
  breakFastPrice: z.coerce.number().optional(),
  roomPrice: z.coerce.number().min(1, {
    message: "Room Price is Required",
  }),
  roomService: z.boolean().optional(),
  balcony: z.boolean().optional(),
  TV: z.boolean().optional(),
  freeWifi: z.boolean().optional(),
  cityView: z.boolean().optional(),
  oceanView: z.boolean().optional(),
  forestView: z.boolean().optional(),
  mountainView: z.boolean().optional(),
  airCondition: z.boolean().optional(),
  soundProofed: z.boolean().optional(),
});

const AddRoomForm = ({ hotel, room, handleDialogueOpen }: AddRoomFormProps) => {
  const [image, setImage] = React.useState<string | undefined>(
    room?.image || ""
  );
  const [imageIsDeleting, setImageIsDeleting] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: room || {
      title: "",
      description: "",
      bedCount: 0,
      guestCount: 0,
      bathroomCount: 0,
      kingBed: 0,
      queenBed: 0,
      image: "",
      breakFastPrice: 0,
      roomPrice: 0,
      roomService: false,
      balcony: false,
      TV: false,
      freeWifi: false,
      cityView: false,
      oceanView: false,
      forestView: false,
      mountainView: false,
      airCondition: false,
      soundProofed: false,
    },
  });

  function handleDeleteImage(image: string) {
    //setImage(undefined);
    const imageKey = image.substring(image.lastIndexOf("/") + 1);
    setImageIsDeleting(true);
    axios
      .post("/api/uploadthing/delete", { imageKey })
      .then((res: any) => {
        if (res.data.success) {
          setImage("");
          // toast({
          //   title: "Image Deleted",
          //   description: "Your image has been deleted",
          //   variant: "default",
          // })
        }
      })
      .catch((error: any) => {
        console.log(error);
        // toast({
        //   title: "Image Deleted",
        //   description: "Something went wrong",
        //   variant: "destructive",
        // })
      })
      .finally(() => {
        setImageIsDeleting(false);
      });
  }

  const router = useRouter();


   React.useEffect(() => {
      if (typeof image === "string") {
        form.setValue("image", image, {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true,
        });
      }
    }, [image]);

   function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    setIsLoading(true);
    if (hotel && room) {
      axios
        .patch(`/api/room/${room._id}`, values)
        .then((res) => {
          alert("ROOM UPDATED!!");
          router.refresh();
          setIsLoading(false);
          handleDialogueOpen()
        })
        .catch((error) => {
          console.log(error);
          setIsLoading(false);
        });
    } else {
      if(!hotel) return;
      axios
        .post("/api/room", {...values, hotelId : hotel?._id})
        .then((res) => {
          alert("room created");
          router.refresh();
          setIsLoading(false);
          handleDialogueOpen();
        })
        .catch((error) => {
          console.log(error);
          setIsLoading(false);
        });
    }
  }


  return (
    <div className="max-h-[75vh] overflow-y-auto px-2">
      <form className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Room Title *</FormLabel>
              <FormDescription>Provide your Room Name</FormDescription>
              <FormControl>
                <Input placeholder="Double Room" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Room Description *</FormLabel>
              <FormDescription>
                Is there anything special about this room?
              </FormDescription>
              <FormControl>
                <Textarea
                  placeholder="Have a beautiful view of the Ocean"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <FormLabel> Choose Room Amenities </FormLabel>
          <FormDescription> What makes this a good choice </FormDescription>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <FormField
              control={form.control}
              name="roomService"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel>24hrs Room Services</FormLabel>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="TV"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel>TV</FormLabel>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="balcony"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel>balcony</FormLabel>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="freeWifi"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel>Free Wifi</FormLabel>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cityView"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel>City View</FormLabel>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="oceanView"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel>Ocean View</FormLabel>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="forestView"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel>Forest View</FormLabel>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="mountainView"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel>Mountain View</FormLabel>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="airCondition"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel>Air Condition</FormLabel>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="soundProofed"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel>Sound Proofed</FormLabel>
                </FormItem>
              )}
            />
          </div>
        </div>
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem className="flex flex-col space-y-3">
              <FormLabel>Upload an Image</FormLabel>
              <FormDescription>
                {" "}
                Choose an image to showcase your Room nicely
              </FormDescription>
              <FormControl>
                {image ? (
                  <div className="relative max-w-[400px] min-w-[200px] max-h-[400px] min-h-[200px] mt-4">
                    <Image
                      src={image}
                      alt="hotel image"
                      width={200}
                      height={180}
                      className="object-contain"
                    />
                    <Button
                      onClick={() => handleDeleteImage(image)}
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="absolute right-\[-12px] top-0"
                    >
                      {imageIsDeleting ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Circle />
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center max-w-[400px] p-12 border-2 border-dashed border-primary/50 rounded mt-4">
                    <UploadButton
                      endpoint="imageUploader"
                      onClientUploadComplete={(res) => {
                        console.log("Files: ", res);
                        alert("Upload Completed");
                        setImage(res[0].url);
                        field.onChange(res[0].url);
                        // toast({
                        //   title: "Image uploaded.",
                        //   description: "Your image has been uploaded.",
                        //   variant: "success",
                        // })
                      }}
                      onUploadError={(error: Error) => {
                        // Do something with the error.
                        // alert(`ERROR! ${error.message}`);
                        console.log(`ERROR! ${error.message}`);
                      }}
                    />
                  </div>
                )}
              </FormControl>
            </FormItem>
          )}
        />
        <div className="flex flex-row gap-6 ">
          <div className="flex-1 flex flex-col gap-6">
            <FormField
              control={form.control}
              name="roomPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Room Price in Naira*</FormLabel>
                  <FormDescription>
                    State the Price for staying in this room for 24hrs
                  </FormDescription>
                  <FormControl>
                    <Input type="number" min={0} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bedCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bed Count*</FormLabel>
                  <FormDescription>
                    How many beds are available in this room
                  </FormDescription>
                  <FormControl>
                    <Input type="number" min={0} max={8} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="guestCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Guest Count*</FormLabel>
                  <FormDescription>
                    How many Guest are allowed in this room
                  </FormDescription>
                  <FormControl>
                    <Input type="number" min={0} max={20} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bathroomCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bathroom Count*</FormLabel>
                  <FormDescription>
                    How many Bathroom are in this room
                  </FormDescription>
                  <FormControl>
                    <Input type="number" min={0} max={8} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex-1 flex flex-col gap-6">
            <FormField
              control={form.control}
              name="breakFastPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>BreakFast Price in Naira*</FormLabel>
                  <FormDescription>
                    State the Price for staying in this room for 24hrs
                  </FormDescription>
                  <FormControl>
                    <Input type="number" min={0} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="kingBed"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>king Bed*</FormLabel>
                  <FormDescription>
                    How many King beds are available in this room
                  </FormDescription>
                  <FormControl>
                    <Input type="number" min={0} max={8} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="queenBed"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Queen Bed*</FormLabel>
                  <FormDescription>
                    How many Guest are allowed in this room
                  </FormDescription>
                  <FormControl>
                    <Input type="number" min={0} max={20} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="pt-4 pb-2">
          {room ? (
            <>
              <Button
                className="max-w-[150px]"
                onClick={form.handleSubmit(onSubmit)}
                disabled={isLoading}
                type="button"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4" />
                    Updating
                  </>
                ) : (
                  <>
                    <PencilLine className="mr-2 h-4 w-4" /> Update
                  </>
                )}
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={form.handleSubmit(onSubmit)}
                className="max-w-[150px]"
                disabled={isLoading}
                type="button"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4" /> Creating
                  </>
                ) : (
                  <>
                    <Pencil className="mr-2 h-4 w-4" /> Create Room
                  </>
                )}
              </Button>
            </>
          )}
        </div>
      </form>
    </div>
  );
};

export default AddRoomForm;
