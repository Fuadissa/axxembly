"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import dynamic from "next/dynamic";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import technologies from "@/lib/technologies"; // Assume technologies contain `name`, `color`, `icon`, and `language`
import { useState } from "react";
import axios from "axios";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import GitHubFileExplorer from "@/components/github-explorer";
import { ImSpinner } from "react-icons/im"; // Import spinner icon
import { IoCheckmarkCircleOutline } from "react-icons/io5"; // Import success icon

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});

import { useToast } from "@/hooks/use-toast";
import { ImageWithSkeleton } from "@/components/imagewithskeleton";

export default function PostCode() {
  const { toast } = useToast();
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [githubCode, setGithubCode] = useState("");
  const [githubCodeEditor, setGithubCodeEditor] = useState<boolean>(false);

  const formSchema = z.object({
    username: z
      .string()
      .min(2, { message: "Username must be at least 2 characters." }),
    title: z
      .string()
      .min(3, { message: "Title must be at least 3 characters." }),
    description: z
      .string()
      .min(10, { message: "Description must be at least 10 characters." }),
    technologies: z
      .array(z.string())
      .nonempty({ message: "Select at least one technology." }),
    externalLinks: z
      .array(
        z.object({
          type: z.string().optional(), // Make `type` optional
          url: z.string().url({ message: "Invalid URL format." }).optional(), // Make `url` optional
        })
      )
      .optional() // Make the `externalLinks` array itself optional
      .refine(
        (links) =>
          !links || links.every((link) => link.url && link.url.trim() !== ""),
        {
          message: "Each external link must have a valid URL.",
        }
      ), // Optional `externalLinks` array
    screenshots: z
      .array(z.string())
      .nonempty({ message: "Select at least one image." }),
    github: z
      .string()
      .url({ message: "Invalid GitHub URL format." })
      .or(z.literal("")) // Allow an empty string
      .nullable() // Allow null for optional fields
      .optional(),
    code: z
      .string()
      .or(z.literal("")) // Allow an empty string
      .nullable() // Allow null for optional fields
      .optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      title: "",
      description: "",
      technologies: [], // Default as empty array
      externalLinks: [], // Default as empty array
      screenshots: [], // Default as empty array
      github: null, // Default as null
      code: null, // Default as null
    },
  });

  const selectedTechnologies = form.watch("technologies");

  const selectedLanguage =
    technologies.find((tech) => selectedTechnologies.includes(tech.name))
      ?.language || "plaintext";

  const handleImageUpload = async (files: FileList | null) => {
    if (!files) return;
    setIsUploading(true);

    const uploadedUrls: string[] = [];
    const cloudinaryUrl = process.env.NEXT_PUBLIC_CLOUDINARY_URL || "";
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET || "";

    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", uploadPreset);

        const response = await axios.post(cloudinaryUrl, formData);

        // Push each secure_url to the uploadedUrls array
        uploadedUrls.push(response.data.secure_url);
      }

      // Set the uploaded URLs in the form if there's at least one URL
      if (uploadedUrls.length > 0) {
        setUploadedImages(uploadedUrls);
        console.log(uploadedUrls);
        form.setValue("screenshots", uploadedUrls as [string, ...string[]]);
      }

      console.log("Uploaded URLs:", uploadedUrls);
    } catch (error) {
      console.error("Error uploading images:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFetchGithubCode = async (githubUrl: string) => {
    try {
      if (form.getValues("github") === "") {
        setGithubCode("");
        setGithubCodeEditor(false);
        return;
      }
      setGithubCode(githubUrl);
      setGithubCodeEditor(true);
    } catch (error) {
      console.error("Error fetching GitHub code:", error);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Show a loading toast
    const loadingToast = toast({
      title: "Uploading...",
      description: (
        <span className="flex items-center gap-2">
          <ImSpinner className="animate-spin text-xl" />{" "}
          <span>Your code is being uploaded. Please wait.</span>
        </span>
      ),
      variant: "default",
      duration: undefined, // Indefinite duration
    });

    try {
      const response = await axios.post("/api/code-posts", {
        ...values,
        selectedLanguage,
      });

      // Dismiss the loading toast
      loadingToast.dismiss();

      if (response.status === 200) {
        // Show a success toast
        toast({
          title: "Success!",
          description: (
            <span className="flex items-center gap-2">
              <IoCheckmarkCircleOutline className="text-green-500 text-2xl" />
              <span>Your code has been Uploaded successfully.</span>
            </span>
          ),
          variant: "default",
        });

        form.reset(); // Reset the form
      } else {
        // Show an error toast for failed request
        toast({
          title: "Submission Failed",
          description:
            "There was an issue submitting your code post. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      // Dismiss the loading toast
      loadingToast.dismiss();

      // Show an error toast for unexpected errors
      toast({
        title: "Error",
        description:
          "An unexpected error occurred while submitting your code post.",
        variant: "destructive",
      });

      console.error("Error submitting code post:", error);
    }
  }

  return (
    <section className="lg:py-10 py-4">
      <div className="container max-w-2xl mx-auto px-4">
        <h1 className="text-4xl font-medium text-center mt-6">Post Code</h1>
        <p className="text-center text-base dark:text-white/50 text-black/50 mt-4 max-w-2xl mx-auto">
          Share your code with the community and help others build amazing
          projects!
        </p>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 mt-8"
          >
            {/* Contributor Name */}
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contributor Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Code Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Code Title</FormLabel>
                  <FormControl>
                    <Input placeholder="E.g., Responsive Navbar" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Code Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Code Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Provide a brief description of your code..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Technology Selection */}
            <FormField
              control={form.control}
              name="technologies"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Technologies</FormLabel>
                  <FormDescription>
                    Select relevant technologies for your code.
                  </FormDescription>
                  <ScrollArea className="h-40 w-full border rounded-md p-2 mt-3">
                    <div className="flex flex-wrap gap-2">
                      {technologies.map((tech) => (
                        <Badge
                          key={tech.name}
                          className={`cursor-pointer border border-white/50 dark:text-white text-black gap-2 bg-transparent p-3 rounded-full 
                            ${
                              field.value.includes(tech.name)
                                ? "text-white"
                                : ""
                            }`}
                          onClick={() => {
                            if (field.value.includes(tech.name)) {
                              field.onChange(
                                field.value.filter((t) => t !== tech.name)
                              );
                            } else {
                              field.onChange([...field.value, tech.name]);
                            }
                          }}
                          style={{
                            backgroundColor: `${
                              field.value.includes(tech.name) ? tech.color : ""
                            }`,
                          }}
                        >
                          <tech.icon
                            style={{
                              color: `${
                                field.value.includes(tech.name)
                                  ? "white"
                                  : tech.color
                              }`,
                            }}
                            size={16}
                          />
                          {tech.name}
                        </Badge>
                      ))}
                    </div>
                  </ScrollArea>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Screenshots */}
            <FormField
              control={form.control}
              name="screenshots"
              render={() => (
                <FormItem>
                  <FormLabel>Images/Screenshots</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e.target.files)}
                    />
                  </FormControl>
                  {isUploading && (
                    <div className="flex items-center justify-center mt-2">
                      <ImSpinner className="animate-spin text-xl" />
                      <span className="ml-2">Uploading...</span>
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            {uploadedImages.length > 0 && (
              <div className="mt-6">
                <Carousel>
                  <CarouselContent>
                    {uploadedImages?.map((url, index) => (
                      <CarouselItem key={index}>
                        <div className="relative w-full h-64 lg:h-80">
                          <ImageWithSkeleton
                            src={url}
                            alt={`Screenshot ${index + 1}`}
                            layout="fill"
                            objectFit="cover"
                            className="rounded-md"
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="sm:left-4" />
                  <CarouselNext className="sm:right-4" />
                </Carousel>
              </div>
            )}

            {/* GitHub */}
            <FormField
              control={form.control}
              name="github"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GitHub Repository</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Paste GitHub repository link..."
                      {...field}
                      value={field.value || ""}
                      onBlur={(e) => handleFetchGithubCode(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Code Editor */}
            {!githubCodeEditor && (
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => {
                  // Loader is shown until MonacoEditor is fully loaded
                  const handleEditorDidMount = () => {
                    setIsEditorReady(true); // Set the editor as ready once it's mounted
                  };
                  return (
                    <FormItem>
                      <FormLabel>Code Editor</FormLabel>
                      <FormDescription>
                        Paste your code below. The language will adjust based on
                        the selected technologies.
                      </FormDescription>

                      {!isEditorReady && (
                        <div className="flex justify-center items-center">
                          {/* You can replace this with any loader component */}
                          <ImSpinner className="mt-4 h-8 w-8 animate-spin" />
                        </div>
                      )}
                      <MonacoEditor
                        language={selectedLanguage}
                        // Bound to form state
                        onChange={(value) => {
                          field.onChange(value || "");
                        }} // Updates form state
                        theme="vs-dark"
                        options={{
                          minimap: { enabled: true },
                          fontSize: 14,
                        }}
                        className="h-[400px] rounded-md md:h-[500px] lg:h-[600px]"
                        onMount={handleEditorDidMount} // Called when Monaco is mounted
                        value={
                          field.value || "// Start writing your code here..."
                        }
                      />
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            )}

            {/* External Links */}
            <FormField
              control={form.control}
              name="externalLinks"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Social Links (Optional)</FormLabel>
                  <FormDescription>
                    Add your social media or other relevant links.
                  </FormDescription>
                  <div className="space-y-4 flex flex-col gap-4">
                    {[
                      "X (Twitter)",
                      "LinkedIn",
                      "Facebook",
                      "GitHub",
                      "Instagram",
                    ].map((platform) => (
                      <div key={platform} className="flex items-center gap-4">
                        <span className="w-[40%] text-sm font-medium">
                          {platform}
                        </span>
                        <Input
                          placeholder={`Add your ${platform} link`}
                          value={
                            field.value?.find((link) => link.type === platform)
                              ?.url || ""
                          }
                          onChange={(e) => {
                            const newLinks = [...(field.value || [])];

                            // Check if the platform link already exists
                            const existingLinkIndex = newLinks.findIndex(
                              (link) => link.type === platform
                            );

                            if (e.target.value.trim() !== "") {
                              if (existingLinkIndex > -1) {
                                // Update the existing link
                                newLinks[existingLinkIndex].url =
                                  e.target.value.trim();
                              } else {
                                // Add a new link
                                newLinks.push({
                                  type: platform,
                                  url: e.target.value.trim(),
                                });
                              }
                            } else if (existingLinkIndex > -1) {
                              // Remove the link if the input is empty
                              newLinks.splice(existingLinkIndex, 1);
                            }

                            // Filter out undefined or empty objects for safety
                            const sanitizedLinks = newLinks.filter(
                              (link) =>
                                link?.type?.trim() && // Ensure `type` is valid
                                link?.url?.trim() // Ensure `url` is valid
                            );

                            // Update the form field value
                            field.onChange(sanitizedLinks);
                          }}
                          className="w-full"
                        />
                      </div>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button type="submit" className="w-full">
              Submit Your Code
            </Button>
          </form>
        </Form>
      </div>

      <div className="p-0 md:container lg:container mt-8">
        {githubCodeEditor && <GitHubFileExplorer githubUrl={githubCode} />}
      </div>
    </section>
  );
}
