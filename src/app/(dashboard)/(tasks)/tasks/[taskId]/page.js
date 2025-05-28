"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
// import { useAuthStore } from "@/store/authStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { CalendarIcon, MessageSquare, GitMerge, User, Calendar, Clock, FileText } from "lucide-react";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import useAuthStore from "@/hooks/useAuth";
import ProtectedRoute from "@/app/_components/ProcectedRoute";

export default function TaskDetailPage() {
  const { taskId } = useParams();
  const [task, setTask] = useState(null);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [date, setDate] = useState(null);
  
  const user = useAuthStore((state) => state.user);
  console.log( useAuthStore((state) => state.user));
  
  useEffect(() => {
      
    const fetchTask = async () => {
      try {
        const res = await api.get(`/tasks/${taskId}`);
        setTask(res.data.task);
        setEditedTask(res.data.task);
      } catch (err) {
        if (err.response) {
          setError(err.response.data.message);
        } else {
          setError("Something went wrong");
        }
      }
    };

    if (taskId) {
      fetchTask();
    }
  }, [taskId]);

  const handleUpdateTask = async () => {
    try {
      // console.log(editedTask);
     const  {deadline,taskDescription}= editedTask;
      const res = await api.patch(`/tasks/${taskId}`,  {deadline,taskDescription});
      setTask(res.data.task);
      setIsEditing(false);
      toast.success("Task updated successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update task");
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const res = await api.post(`/tasks/${taskId}/comments`, {
        comment: newComment
      });
      setTask(res.data.task);
      setNewComment("");
      toast.success("Comment added successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add comment");
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      const res = await api.put(`/tasks/${taskId}`, {
        taskStatus: newStatus
      });
    //   setTask(res.data.task);
    setTask((prev) => ({
             ...prev,
              taskStatus: newStatus
           }));
      toast.success("Status updated successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update status");
    }
  };

  if (error) return <p className="text-red-600">{error}</p>;
  if (!task) return <p>Loading task details...</p>;
console.log(user?.role);

  const isManager = user?.role === "manager";
  const canUpdateStatus = ["developer", "uiux", "seo"].includes(user?.role);

  return (
    <ProtectedRoute allowedRoles={['uiux', 'manager',"seo","developer","admin"]}>

    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Task Details</h1>
        {isManager && (
          <Button
            variant={isEditing ? "destructive" : "default"}
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? "Cancel" : "Edit Task"}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Task Info */}
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CardTitle className="text-2xl">{task.taskName}</CardTitle>
              {task.iscollaborator && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <GitMerge className="h-3 w-3" />
                  Collaborative
                </Badge>
              )}
            </div>
            <CardDescription>Project: {task.project?.projectName}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEditing ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={editedTask.taskDescription}
                    onChange={(e) => setEditedTask({ ...editedTask, taskDescription: e.target.value })}
                    className="min-h-[100px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Deadline</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={date}
                        onSelect={(newDate) => {
                          setDate(newDate);
                          setEditedTask({
                            ...editedTask,
                            deadline: newDate.toISOString()
                          });
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <Button onClick={handleUpdateTask}>Save Changes</Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground">{task.taskDescription}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Start: {format(new Date(task.startDate), "PPP")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>Deadline: {format(new Date(task.deadline), "PPP")}</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Task Status and Comments */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Task Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    task.taskStatus === "completed" ? "success" :
                    task.taskStatus === "in-progress" ? "warning" :
                    "secondary"
                  }
                  className="capitalize"
                >
                  {task.taskStatus.replace("_", " ")}
                </Badge>
                {canUpdateStatus && (
                  <Select
                    value={task.taskStatus}
                    onValueChange={handleStatusChange}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Update Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
              <Separator />
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>Assigned To: {task.taskAssignedTo?.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>Assigned By: {task.taskAssignedBy?.name}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Comments
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4  ">
              <div className="space-y-4 max-h-50 overflow-auto">
                {[...task.taskComments].reverse()?.map((comment, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span className="font-semibold">{comment.commentBy?.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(comment.commentAt), "PPP")}
                      </span>
                    </div>
                    <p className="text-sm">{comment.comment}</p>
                    <Separator />
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <Textarea
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <Button onClick={handleAddComment}>Add Comment</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    </ProtectedRoute>
  );
}
