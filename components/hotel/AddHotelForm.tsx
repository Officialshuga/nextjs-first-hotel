"use client";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { UploadButton } from "../uploadthing";
import Image from "next/image";
import { Button } from "../ui/button";
import {
  Circle,
  Eye,
  Loader2,
  Pencil,
  PencilLine,
  Plus,
  Terminal,
  Trash,
} from "lucide-react";
import axios from "axios";
import useLocation from "@/hooks/useLocation";
import { ICity, IState } from "country-state-city";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AddRoomForm from "../room/AddRoomForm";
import { IHotel, IRoom } from '@/models/Hotel';




// export interface IRoom {
//   id: string;
//   title: string;
//   price: number;
// }

interface AddHotelFormProps {
  hotel?: HotelWithRooms;
}

export type HotelWithRooms = IHotel & {
  rooms: IRoom[];
};

const formSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters long" }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 3 characters long" }),
  country: z.string().min(1, { message: "Country is required" }),
  locationDescription: z
    .string()
    .min(10, { message: "Description must be at least 3 characters long" }),
  state: z.string().min(1, { message: "State is required" }),
  city: z.string().min(1, { message: "City is required" }),
  gym: z.boolean().optional(),
  bar: z.boolean().optional(),
  spa: z.boolean().optional(),
  laundry: z.boolean().optional(),
  restaurant: z.boolean().optional(),
  shopping: z.boolean().optional(),
  freeParking: z.boolean().optional(),
  bikeRental: z.boolean().optional(),
  freeWifi: z.boolean().optional(),
  movieNights: z.boolean().optional(),
  swimmingPool: z.boolean().optional(),
  coffeShop: z.boolean().optional(),
  price: z.number().min(0, { message: "Price must be at least 0" }),
  image: z.string().min(1, { message: "Image is required" }),
});

const AddHotelForm = ({ hotel }: AddHotelFormProps) => {
  const [image, setImage] = React.useState<string | undefined>(
    hotel?.image || ""
  );
  const [imageIsDeleting, setImageIsDeleting] = React.useState(false);
  const [states, setStates] = React.useState<IState[]>([]);
  const [cities, setCities] = React.useState<ICity[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isHotelDeleting, setIsHotelDeleting] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const { getAllCountries, getCountryStates, getStateCities } = useLocation();
  const countries = getAllCountries();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: hotel || {
      title: "",
      locationDescription: "",
      country: "",
      description: "",
      state: "",
      city: "",
      image: "",
      gym: false,
      spa: false,
      bar: false,
      laundry: false,
      restaurant: false,
      shopping: false,
      freeParking: false,
      bikeRental: false,
      freeWifi: false,
      movieNights: false,
      swimmingPool: false,
      coffeShop: false,
      price: 0,
    },
  });

  React.useEffect(() => {
    if (typeof image === "string") {
      form.setValue("image", image, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
    }
  }, [image]);

  React.useEffect(() => {
    const selectedCountry = form.watch("country");
    const countryStates = getCountryStates(selectedCountry);
    if (countryStates) {
      setStates(countryStates);
    }
    //console.log("Form errors:", form.formState.errors);
  }, [form.watch("country")]);

  React.useEffect(() => {
    const selectedCountry = form.watch("country");
    const selectedState = form.watch("state");
    const stateCities = getStateCities(selectedCountry, selectedState);
    if (stateCities) {
      setCities(stateCities);
    }
    //console.log("Form errors:", form.formState.errors);
  }, [form.watch("country"), form.watch("state")]);

  React.useEffect(() => {
    const selectedCountry = form.watch("country");
    const countryStates = getCountryStates(selectedCountry);
    if (countryStates) {
      setStates(countryStates);
    }
    //console.log("Form errors:", form.formState.errors);
  }, [form.watch("country")]);

  // const form = useForm<z.infer<typeof formSchema>>({
  //   resolver: zodResolver(formSchema),
  //   defaultValues: {
  //     title: "",
  //     locationDescription: "",
  //     country: "",
  //     description: "",
  //     state: "",
  //     city: "",
  //     image: "",
  //     gym: false,
  //     spa: false,
  //     bar: false,
  //     laundry: false,
  //     restaurant: false,
  //     shopping: false,
  //     freeParking: false,
  //     bikeRental: false,
  //     freeWifi: false,
  //     movieNights: false,
  //     swimmingPool: false,
  //     coffeShop: false,
  //     price: 0,
  //   },
  // });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    setIsLoading(true);
    if (hotel) {
      axios
        .patch(`/api/hotel/${hotel._id}`, values)
        .then((res) => {
          alert("HOTEL UPDATED!!");
          router.push(`/hotel/${res.data._id}`);
          setIsLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setIsLoading(false);
        });
    } else {
      axios
        .post("/api/hotel", values)
        .then((res) => {
          alert("hotel created");
          router.push(`/hotel/${res.data._id}`);
          setIsLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setIsLoading(false);
        });
    }
  }

  const handleDeleteHotel = async (hotel: HotelWithRooms) => {
    setImageIsDeleting(true);
    const getImageKey = (src: string) =>
      src.substring(src.lastIndexOf("/") + 1);
    try {
      const imageKey = getImageKey(hotel.image);
      await axios.post("/api/uploadthing/delete", { imageKey });
      await axios.delete(`/api/hotel/${hotel._id}`);
      setIsHotelDeleting(false);
      alert("DELETED SUCCESSFULY!!!!");
      router.push("/hotel/new");
    } catch (error) {
      setIsHotelDeleting(false);
      console.log("FAILED TO DELETE", error);
    }
  };

  function handleDeleteImage(image: string) {
    //setImage(undefined);
    const imageKey = image.substring(image.lastIndexOf("/") + 1);
    setImageIsDeleting(true);
    axios
      .post("/api/uploadthing/delete", { imageKey })
      .then((res) => {
        if (res.data.success) {
          setImage("");
          // toast({
          //   title: "Image Deleted",
          //   description: "Your image has been deleted",
          //   variant: "default",
          // })
        }
      })
      .catch((err) => {
        console.log(err);
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

  const handleDialogueOpen = ()=>{
    setOpen(prev => !prev)
  }
  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <h3 className="text-lg font-semibold">
            {" "}
            {hotel ? "Update your hotel" : "Describe your Hotel"}{" "}
          </h3>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 flex flex-col gap-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hotel Title *</FormLabel>
                    <FormDescription>Provide your Hotel Name</FormDescription>
                    <FormControl>
                      <Input placeholder="Beach Hotel" {...field} />
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
                    <FormLabel>Hotel Description*</FormLabel>
                    <FormDescription>
                      Provide a detailed Description of your Hotel
                    </FormDescription>
                    <FormControl>
                      <Textarea
                        placeholder="Beach Hotel is Packed with many awesome Amenities"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div>
                <FormLabel> Choose Amenities </FormLabel>
                <FormDescription>
                  {" "}
                  Choose Amenities popular in your hotel{" "}
                </FormDescription>
                {/* <FormDescription> */}
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <FormField
                    control={form.control}
                    name="gym"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Gym</FormLabel>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="spa"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Spa</FormLabel>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bar"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Bar</FormLabel>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="laundry"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Laundry Facilities</FormLabel>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="restaurant"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Restaurant</FormLabel>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="shopping"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Shopping</FormLabel>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="freeParking"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Free Parking</FormLabel>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bikeRental"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Bike Rental</FormLabel>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="movieNights"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Movie Nights</FormLabel>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="swimmingPool"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Swimming Pool</FormLabel>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="coffeShop"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Coffee Shop</FormLabel>
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
                      Choose an image to showcase your hotel nicely
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
            </div>
            <div className="flex-1 flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Country</FormLabel>
                      <FormDescription>
                        Which Country is your Property located
                      </FormDescription>
                      <FormControl>
                        <Select
                          disabled={isLoading}
                          onValueChange={field.onChange}
                          value={field.value || ""}
                          defaultValue={field.value || ""}
                        >
                          <SelectTrigger className="bg-background">
                            <SelectValue
                              defaultValue={field.value || ""}
                              placeholder="Select a Country"
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {countries.map((country) => {
                              return (
                                <SelectItem
                                  key={country.isoCode}
                                  value={country.isoCode}
                                >
                                  {country.name}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select State</FormLabel>
                      <FormDescription>
                        Which State is your Property located
                      </FormDescription>
                      <FormControl>
                        <Select
                          disabled={isLoading || states.length < 1}
                          onValueChange={field.onChange}
                          value={field.value || ""}
                          defaultValue={field.value || ""}
                        >
                          <SelectTrigger className="bg-background">
                            <SelectValue
                              defaultValue={field.value || ""}
                              placeholder="Select a State"
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {states.map((state) => {
                              return (
                                <SelectItem
                                  key={state.isoCode}
                                  value={state.isoCode}
                                >
                                  {state.name}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select City</FormLabel>
                    <FormDescription>
                      Which City is your Property located
                    </FormDescription>
                    <FormControl>
                      <Select
                        disabled={isLoading || cities.length < 1}
                        onValueChange={field.onChange}
                        value={field.value || ""}
                        defaultValue={field.value || ""}
                      >
                        <SelectTrigger className="bg-background">
                          <SelectValue
                            defaultValue={field.value || ""}
                            placeholder="Select a City"
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {cities.map((city) => {
                            return (
                              <SelectItem key={city.name} value={city.name}>
                                {city.name}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="locationDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location Description*</FormLabel>
                    <FormDescription>
                      Provide a detailed Location Description of your Hotel
                    </FormDescription>
                    <FormControl>
                      <Textarea
                        placeholder="Located at the very end of the beach road"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (₦)</FormLabel>
                    <FormDescription>Enter the price per night</FormDescription>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="50000"
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {hotel && !hotel.rooms?.length && (
                <Alert className="bg-indigo-600 text-white">
                  <Terminal className="h-4 w-4 stroke-white" />
                  <AlertTitle>One Last Step!!</AlertTitle>
                  <AlertDescription>
                    Your Hotel was Created Successfully,
                    <div>Please Add Rooms to complete your hotel setup!</div>
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex justify-between gap-2 flex-wrap">
                {hotel && (
                  <Button
                    onClick={() => handleDeleteHotel(hotel)}
                    variant="ghost"
                    type="button"
                    className="max-w-[150px]"
                    disabled={isHotelDeleting || isLoading}
                  >
                    {isHotelDeleting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4" /> Deleting
                      </>
                    ) : (
                      <>
                        <Trash className="mr-2 h-4 w-4" /> Delete
                      </>
                    )}
                  </Button>
                )}

                {hotel && (
                  <Button
                    onClick={() => router.push(`/hotel-details/${hotel._id}`)}
                    variant="outline"
                    type="button"
                  >
                    {" "}
                    <Eye className="mr-2 h-4 w-4" />
                    View{" "}
                  </Button>
                )}


                {hotel && 
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger><Button type="button" variant='outline' className="max-w-[150px]"> <Plus className="mr-2 h-4 w-4"/> Add Room</Button></DialogTrigger>
                  <DialogContent className="max-w-[900px] w-[90%]">
                    <DialogHeader className="px-2">
                      <DialogTitle>Add a Room</DialogTitle>
                      <DialogDescription>
                        Add Details about room in your hotel.
                      </DialogDescription>
                    </DialogHeader>
                    <AddRoomForm hotel={hotel} handleDialogueOpen={handleDialogueOpen}/>
                  </DialogContent>
                </Dialog>
                }


                {hotel ? (
                  <>
                    <Button
                      className="max-w-[150px]"
                      disabled={isLoading}
                      type="submit"
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
                      className="max-w-[150px]"
                      disabled={isLoading}
                      type="submit"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4" /> Creating
                        </>
                      ) : (
                        <>
                          <Pencil className="mr-2 h-4 w-4" /> Create Hotel
                        </>
                      )}
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AddHotelForm;
