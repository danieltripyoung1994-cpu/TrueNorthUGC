import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2, Mail, Send, Inbox, ChevronDown, ChevronUp, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import type { Message } from "@shared/schema";

const composeSchema = z.object({
  receiverId: z.string().min(1, "Recipient is required"),
  receiverType: z.string().min(1, "Recipient type is required"),
  subject: z.string().min(1, "Subject is required"),
  content: z.string().min(1, "Message content is required"),
});

type ComposeFormData = z.infer<typeof composeSchema>;

function formatDate(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

function MessageItem({ message, type }: { message: Message; type: "inbox" | "sent" }) {
  const [expanded, setExpanded] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const markReadMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", `/api/messages/${message.id}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages/inbox"] });
    },
  });

  const isUnread = message.read === "false";

  const handleExpand = () => {
    setExpanded(!expanded);
    if (type === "inbox" && isUnread && !expanded) {
      markReadMutation.mutate();
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`border rounded-md p-3 sm:p-4 hover-elevate cursor-pointer transition-all ${
        isUnread && type === "inbox" ? "bg-primary/5 border-primary/20" : "bg-card"
      }`}
      onClick={handleExpand}
      data-testid={`message-item-${message.id}`}
    >
      <div className="flex justify-between items-start gap-2 sm:gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            {isUnread && type === "inbox" && (
              <Badge variant="default" className="text-xs">New</Badge>
            )}
            <span className="font-semibold truncate">{message.subject}</span>
          </div>
          <p className="text-sm text-muted-foreground truncate">
            {type === "inbox" ? `From: ${message.senderId}` : `To: ${message.receiverId}`}
          </p>
          {!expanded && (
            <p className="text-sm text-muted-foreground mt-1 truncate">
              {message.content.substring(0, 80)}...
            </p>
          )}
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {formatDate(message.createdAt)}
          </span>
          {expanded ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </div>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-4 mt-4 border-t">
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function Messages() {
  const [activeTab, setActiveTab] = useState<"inbox" | "sent">("inbox");
  const [composeOpen, setComposeOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: inboxMessages, isLoading: loadingInbox } = useQuery<Message[]>({
    queryKey: ["/api/messages/inbox"],
    queryFn: async () => {
      const res = await fetch("/api/messages/inbox", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch inbox");
      return res.json();
    },
  });

  const { data: sentMessages, isLoading: loadingSent } = useQuery<Message[]>({
    queryKey: ["/api/messages/sent"],
    queryFn: async () => {
      const res = await fetch("/api/messages/sent", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch sent messages");
      return res.json();
    },
  });

  const form = useForm<ComposeFormData>({
    resolver: zodResolver(composeSchema),
    defaultValues: {
      receiverId: "",
      receiverType: "creator",
      subject: "",
      content: "",
    },
  });

  const sendMutation = useMutation({
    mutationFn: async (data: ComposeFormData) => {
      const res = await apiRequest("POST", "/api/messages", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages/sent"] });
      queryClient.invalidateQueries({ queryKey: ["/api/messages/inbox"] });
      setComposeOpen(false);
      form.reset();
      toast({
        title: "Message Sent",
        description: "Your message has been sent successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ComposeFormData) => {
    sendMutation.mutate(data);
  };

  const isLoading = activeTab === "inbox" ? loadingInbox : loadingSent;
  const messages = activeTab === "inbox" ? inboxMessages : sentMessages;
  const unreadCount = inboxMessages?.filter(m => m.read === "false").length || 0;

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="px-0 sm:px-6 pb-4">
        <div className="flex justify-between items-center gap-2 sm:gap-4 flex-wrap">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Mail className="h-4 w-4 sm:h-5 sm:w-5" />
            Messages
            {unreadCount > 0 && (
              <Badge variant="default" className="ml-1 sm:ml-2 text-xs">{unreadCount} unread</Badge>
            )}
          </CardTitle>
          <Dialog open={composeOpen} onOpenChange={setComposeOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="h-9" data-testid="button-compose-message">
                <Plus className="mr-1 sm:mr-2 h-4 w-4" />
                <span className="hidden xs:inline">Compose</span>
                <span className="xs:hidden">New</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg mx-4 sm:mx-auto">
              <DialogHeader>
                <DialogTitle>New Message</DialogTitle>
                <DialogDescription className="sr-only">Compose and send a message to another user on the platform.</DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                  <FormField
                    control={form.control}
                    name="receiverId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Recipient Handle/ID</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter recipient's handle" 
                            {...field} 
                            data-testid="input-receiver-id"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Message subject" 
                            {...field} 
                            data-testid="input-message-subject"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Write your message..." 
                            className="min-h-32 resize-none" 
                            {...field} 
                            data-testid="textarea-message-content"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={sendMutation.isPending}
                    data-testid="button-send-message"
                  >
                    {sendMutation.isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="mr-2 h-4 w-4" />
                    )}
                    Send Message
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="px-0 sm:px-6">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "inbox" | "sent")}>
          <TabsList className="mb-4 w-full sm:w-auto">
            <TabsTrigger value="inbox" className="gap-1 sm:gap-2 flex-1 sm:flex-none" data-testid="tab-inbox">
              <Inbox className="h-4 w-4" />
              <span>Inbox</span>
              {unreadCount > 0 && (
                <Badge variant="secondary" className="ml-1 text-xs">{unreadCount}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="sent" className="gap-1 sm:gap-2 flex-1 sm:flex-none" data-testid="tab-sent">
              <Send className="h-4 w-4" />
              <span>Sent</span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="inbox" className="space-y-3">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : messages?.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Inbox className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No messages in your inbox</p>
              </div>
            ) : (
              messages?.map((message) => (
                <MessageItem key={message.id} message={message} type="inbox" />
              ))
            )}
          </TabsContent>
          <TabsContent value="sent" className="space-y-3">
            {loadingSent ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : sentMessages?.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Send className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No sent messages</p>
              </div>
            ) : (
              sentMessages?.map((message) => (
                <MessageItem key={message.id} message={message} type="sent" />
              ))
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
