import { useState } from "react"
import { useAuth } from "@clerk/nextjs"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import es from "date-fns/locale/es"
import { CalendarIcon, RotateCwIcon } from "lucide-react"
import { SubmitHandler, useForm } from "react-hook-form"
import { z } from "zod"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/react-fook-form/form"

const validationSchema = z.object({
  summitDate: z.date({
    required_error: "Introduce la fecha del ascenso.",
    invalid_type_error: "La fecha del ascenso debe ser una fecha.",
  }),
  summitTime: z
    .number({
      required_error: "Introduce la duración del ascenso.",
      invalid_type_error: "El tiempo de ascenso debe ser un número.",
    })
    .min(1, { message: "El tiempo de ascenso debe ser mayor que 1." })
    .max(100, { message: "El tiempo de ascenso debe ser menor que 100." }),
  summitWeather: z
    .boolean({
      required_error: "Marca si había nieve en el ascenso.",
    })
    .default(false),
})

type FormValues = z.infer<typeof validationSchema>

const defaultValues: Partial<FormValues> = {
  summitDate: new Date(),
  summitTime: 1,
  summitWeather: false,
}

export const AddForm = ({
  peak,
  addSummitMutation,
}: {
  peak: any
  addSummitMutation: any
}) => {
  const [serverError, setServerError] = useState("")
  const [success, setSuccess] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const { isLoaded, userId } = useAuth()

  const form = useForm<FormValues>({
    resolver: zodResolver(validationSchema),
    defaultValues,
  })

  const onSubmit: SubmitHandler<FormValues> = async (formData: any) => {
    if (submitting) {
      return false
    }
    setSubmitting(true)
    setServerError("")

    const data = await addSummitMutation({
      peakId: peak.id,
      userId: userId,
      summitDate: formData.summitDate,
      summitTime: formData.summitTime,
      summitWeather: formData.summitWeather,
    })

    setSubmitting(false)

    return data
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-5 space-y-10">
        <FormField
          control={form.control}
          name="summitDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Fecha</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP", { locale: es })
                      ) : (
                        <span>Elije una fecha de ascenso.</span>
                      )}

                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>Elije la fecha de ascenso.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="summitTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Duración</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Duración del ascenso en horas."
                  {...field}
                  onChange={(event) => field.onChange(+event.target.value)}
                />
              </FormControl>
              <FormDescription>
                {`Introduce la duración del ascenso (en horas).`}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="summitWeather"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Clima</FormLabel>
                <FormDescription>
                  Pincha el toggle si el pico estaba nevado.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit">
          {submitting ? (
            <p className="flex items-center gap-x-1">
              <span>{`Añadiendo`}</span>
              <RotateCwIcon className="animate-spin" />
            </p>
          ) : (
            <p>{`Añadir`}</p>
          )}
        </Button>
      </form>
    </Form>
  )
}
