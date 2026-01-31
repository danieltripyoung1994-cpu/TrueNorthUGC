import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateCampaign, useUpdateCampaign } from "@/hooks/use-campaigns";
import { type Campaign } from "@shared/schema";
import { Loader2, Plus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const NICHES = ["Fitness", "Beauty", "Tech", "Travel", "Food", "Fashion", "Lifestyle", "Gaming"];

const campaignFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  requirements: z.string().optional(),
  budget: z.string().optional(),
  deadline: z.string().optional(),
  location: z.string().optional(),
  status: z.enum(["active", "paused", "closed"]),
});

type CampaignFormValues = z.infer<typeof campaignFormSchema>;

interface CampaignFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaign?: Campaign | null;
}

export function CampaignFormModal({ open, onOpenChange, campaign }: CampaignFormModalProps) {
  const createCampaign = useCreateCampaign();
  const updateCampaign = useUpdateCampaign();
  const isEditing = !!campaign;
  
  const [niches, setNiches] = useState<string[]>([]);
  const [deliverables, setDeliverables] = useState<string[]>([]);
  const [newDeliverable, setNewDeliverable] = useState("");

  const form = useForm<CampaignFormValues>({
    resolver: zodResolver(campaignFormSchema),
    defaultValues: {
      title: "",
      description: "",
      requirements: "",
      budget: "",
      deadline: "",
      location: "",
      status: "active",
    },
  });

  useEffect(() => {
    if (campaign) {
      form.reset({
        title: campaign.title,
        description: campaign.description,
        requirements: campaign.requirements || "",
        budget: campaign.budget || "",
        deadline: campaign.deadline ? campaign.deadline.split("T")[0] : "",
        location: campaign.location || "",
        status: campaign.status as "active" | "paused" | "closed",
      });
      setNiches(campaign.niches || []);
      setDeliverables(campaign.deliverables || []);
    } else {
      form.reset({
        title: "",
        description: "",
        requirements: "",
        budget: "",
        deadline: "",
        location: "",
        status: "active",
      });
      setNiches([]);
      setDeliverables([]);
    }
  }, [campaign, form]);

  const toggleNiche = (niche: string) => {
    setNiches(prev => 
      prev.includes(niche) 
        ? prev.filter(n => n !== niche)
        : [...prev, niche]
    );
  };

  const addDeliverable = () => {
    if (newDeliverable.trim()) {
      setDeliverables(prev => [...prev, newDeliverable.trim()]);
      setNewDeliverable("");
    }
  };

  const removeDeliverable = (index: number) => {
    setDeliverables(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: CampaignFormValues) => {
    const campaignData = {
      ...data,
      niches,
      deliverables,
      deadline: data.deadline || null,
      requirements: data.requirements || null,
      budget: data.budget || null,
      location: data.location || null,
    };

    try {
      if (isEditing && campaign) {
        await updateCampaign.mutateAsync({ id: campaign.id, data: campaignData });
      } else {
        await createCampaign.mutateAsync(campaignData);
      }
      onOpenChange(false);
    } catch (e) {}
  };

  const isPending = createCampaign.isPending || updateCampaign.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold" data-testid="text-campaign-form-title">
            {isEditing ? "Edit Campaign" : "Create New Campaign"}
          </DialogTitle>
          <DialogDescription>
            {isEditing ? "Update your campaign details" : "Fill in the details to create a new campaign"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Campaign Title</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g. Summer Product Launch Video" 
                      {...field} 
                      data-testid="input-campaign-title"
                    />
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
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe what you're looking for in this campaign..." 
                      className="resize-none h-24"
                      {...field} 
                      data-testid="textarea-campaign-description"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="requirements"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Requirements (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Specific requirements for creators applying..." 
                      className="resize-none h-20"
                      {...field} 
                      data-testid="textarea-campaign-requirements"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Budget (Optional)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g. $500 - $1000" 
                        {...field} 
                        data-testid="input-campaign-budget"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="deadline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deadline (Optional)</FormLabel>
                    <FormControl>
                      <Input 
                        type="date" 
                        {...field} 
                        data-testid="input-campaign-deadline"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Location (Optional)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g. Toronto, ON" 
                        {...field} 
                        data-testid="input-campaign-location"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-campaign-status">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="paused">Paused</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <FormLabel>Niches</FormLabel>
              <div className="flex flex-wrap gap-2 mt-2">
                {NICHES.map((niche) => (
                  <Badge
                    key={niche}
                    variant={niches.includes(niche) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleNiche(niche)}
                    data-testid={`badge-niche-${niche}`}
                  >
                    {niche}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <FormLabel>Deliverables</FormLabel>
              <div className="flex gap-2 mt-2">
                <Input
                  placeholder="e.g. 1 TikTok video"
                  value={newDeliverable}
                  onChange={(e) => setNewDeliverable(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addDeliverable())}
                  data-testid="input-new-deliverable"
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  size="icon"
                  onClick={addDeliverable}
                  data-testid="button-add-deliverable"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {deliverables.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {deliverables.map((d, i) => (
                    <Badge key={i} variant="secondary" className="pr-1">
                      {d}
                      <button
                        type="button"
                        className="ml-1 hover:text-destructive"
                        onClick={() => removeDeliverable(i)}
                        data-testid={`button-remove-deliverable-${i}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                className="flex-1"
                onClick={() => onOpenChange(false)}
                data-testid="button-cancel-campaign"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="flex-1" 
                disabled={isPending}
                data-testid="button-submit-campaign"
              >
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? "Update Campaign" : "Create Campaign"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
