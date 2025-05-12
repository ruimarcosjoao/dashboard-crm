"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import * as Kanban from "@/components/ui/kanban";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { GripVertical } from "lucide-react";
import * as React from "react";
import { useForm } from "react-hook-form";

interface Task {
  id: string;
  title: string;
  priority: "low" | "medium" | "high";
  description?: string;
  assignee?: string;
  dueDate?: string;
}

const COLUMN_TITLES: Record<string, string> = {
  backlog: "Backlog",
  inProgress: "In Progress",
  review: "Review",
  done: "Done",
};

export default function KanbanDynamicOverlayDemo() {
  const [columns, setColumns] = React.useState<Record<string, Task[]>>({
    beggin: [
      {
        id: "1",
        title: "Add authentication",
        priority: "high",
        assignee: "John Doe",
        dueDate: "2024-04-01",
      },
      {
        id: "2",
        title: "Create API endpoints",
        priority: "medium",
        assignee: "Jane Smith",
        dueDate: "2024-04-05",
      },
      {
        id: "3",
        title: "Write documentation",
        priority: "low",
        assignee: "Bob Johnson",
        dueDate: "2024-04-10",
      },
    ],
    inProgress: [
      {
        id: "4",
        title: "Design system updates",
        priority: "high",
        assignee: "Alice Brown",
        dueDate: "2024-03-28",
      },
      {
        id: "5",
        title: "Implement dark mode",
        priority: "medium",
        assignee: "Charlie Wilson",
        dueDate: "2024-04-02",
      },
    ],
    done: [
      {
        id: "7",
        title: "Setup project",
        priority: "high",
        assignee: "Eve Davis",
        dueDate: "2024-03-25",
      },
      {
        id: "8",
        title: "Initial commit",
        priority: "low",
        assignee: "Frank White",
        dueDate: "2024-03-24",
      },
    ],
  });

  const handleAddTask = () => {
    const newTask: Task = {
      id: Date.now().toString(), // gera ID simples
      title: "Nova Tarefa",
      priority: "low",
      assignee: "Novo membro",
      dueDate: new Date().toISOString().split("T")[0], // data de hoje
    };

    setColumns((prev) => ({
      ...prev,
      beggin: [newTask, ...prev.beggin],
    }));
  };

  return (
    <div className="container mx-auto max-w-5xl">
      <div className="pb-6 flex flex-row items-center justify-between">
        <h2 className="text-2xl font-bold">Tarefas</h2>
        <Sheet>
          <SheetTrigger asChild>
            <Button>Adicionar</Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Nova Tarefa</SheetTitle>
            </SheetHeader>
            <AddTaskForm
              onAddTask={(task) => {
                setColumns((prev) => ({
                  ...prev,
                  beggin: [
                    { ...task, id: Date.now().toString() },
                    ...prev.beggin,
                  ],
                }));
              }}
            />
          </SheetContent>
        </Sheet>
      </div>
      <Kanban.Root
        value={columns}
        onValueChange={setColumns}
        getItemValue={(item) => item.id}
      >
        <Kanban.Board className="grid auto-rows-fr grid-cols-3">
          {Object.entries(columns).map(([columnValue, tasks]) => (
            <TaskColumn key={columnValue} value={columnValue} tasks={tasks} />
          ))}
        </Kanban.Board>
        <Kanban.Overlay>
          {({ value, variant }) => {
            if (variant === "column") {
              const tasks = columns[value] ?? [];

              return <TaskColumn value={value} tasks={tasks} />;
            }

            const task = Object.values(columns)
              .flat()
              .find((task) => task.id === value);

            if (!task) return null;

            return <TaskCard task={task} />;
          }}
        </Kanban.Overlay>
      </Kanban.Root>
      <pre>{JSON.stringify(columns, null, 2)}</pre>
    </div>
  );
}

interface TaskCardProps
  extends Omit<React.ComponentProps<typeof Kanban.Item>, "value"> {
  task: Task;
}

function TaskCard({ task, ...props }: TaskCardProps) {
  return (
    <Kanban.Item key={task.id} value={task.id} asChild {...props}>
      <div className="rounded-md border bg-card p-3 shadow-xs">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <span className="line-clamp-1 font-medium text-sm">
              {task.title}
            </span>
            <Badge
              variant={
                task.priority === "high"
                  ? "destructive"
                  : task.priority === "medium"
                  ? "default"
                  : "secondary"
              }
              className="pointer-events-none h-5 rounded-sm px-1.5 text-[11px] capitalize"
            >
              {task.priority}
            </Badge>
          </div>
          <div className="flex items-center justify-between text-muted-foreground text-xs">
            {task.assignee && (
              <div className="flex items-center gap-1">
                <div className="size-2 rounded-full bg-primary/20" />
                <span className="line-clamp-1">{task.assignee}</span>
              </div>
            )}
            {task.dueDate && (
              <time className="text-[10px] tabular-nums">{task.dueDate}</time>
            )}
          </div>
        </div>
      </div>
    </Kanban.Item>
  );
}

interface TaskColumnProps
  extends Omit<React.ComponentProps<typeof Kanban.Column>, "children"> {
  tasks: Task[];
}

function TaskColumn({ value, tasks, ...props }: TaskColumnProps) {
  return (
    <Kanban.Column value={value} {...props}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm">{COLUMN_TITLES[value]}</span>
          <Badge variant="secondary" className="pointer-events-none rounded-sm">
            {tasks.length}
          </Badge>
        </div>
        <Kanban.ColumnHandle asChild>
          <Button variant="ghost" size="icon">
            <GripVertical className="h-4 w-4" />
          </Button>
        </Kanban.ColumnHandle>
      </div>
      <div className="flex flex-col gap-2 p-0.5">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} asHandle />
        ))}
      </div>
    </Kanban.Column>
  );
}

interface AddTaskFormProps {
  onAddTask: (task: Omit<Task, "id">) => void;
}

function AddTaskForm({ onAddTask }: AddTaskFormProps) {
  const { register, handleSubmit, reset, setValue, watch } = useForm<
    Omit<Task, "id">
  >({
    defaultValues: {
      title: "",
      priority: "low",
      assignee: "",
      dueDate: "",
    },
  });

  const onSubmit = (data: Omit<Task, "id">) => {
    onAddTask(data);
    reset(); // limpa formulário
    const sheet = document.querySelector("[data-state=open] [data-dismiss]");
    (sheet as HTMLElement)?.click(); // fecha sheet
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4 p-4">
      <div>
        <Label htmlFor="title">Título</Label>
        <Input id="title" {...register("title")} required />
      </div>

      <div>
        <Label htmlFor="assignee">Responsável</Label>
        <Input id="assignee" {...register("assignee")} required />
      </div>

      <div>
        <Label htmlFor="dueDate">Data de Entrega</Label>
        <Input type="date" id="dueDate" {...register("dueDate")} required />
      </div>

      <div>
        <Label htmlFor="priority">Prioridade</Label>
        <Select
          onValueChange={(value) =>
            setValue("priority", value as Task["priority"])
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Baixa</SelectItem>
            <SelectItem value="medium">Média</SelectItem>
            <SelectItem value="high">Alta</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" className="w-full">
        Salvar
      </Button>
    </form>
  );
}
