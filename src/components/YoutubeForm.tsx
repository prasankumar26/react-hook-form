import { useForm } from "react-hook-form"
import { DevTool } from "@hookform/devtools"

type FormValues = {
  username: string,
  email: string,
  channel: string,
}

const YoutubeForm = () => {
  const form = useForm<FormValues>();
  const {register, control, handleSubmit, formState, reset} = form; 
  const {errors} = formState; 

  const onSubmit = (data:FormValues) =>{
    console.log("form submitted", data);
    alert(JSON.stringify(data))
    reset();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
   
   <div className="form-control">
   <label htmlFor="username">Username</label>
    <input 
    type="text" 
    id="username" 
    {...register("username", {
      required: 'Username is required'
    })}
    />
    <p className="error">{errors?.username?.message}</p>
   </div>

    <div className="form-control">
    <label htmlFor="email">E-mail</label>
    <input type="email" id="email" {...register("email", {
       required: 'Email is required',
       pattern: {
         value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
         message: 'Invalid email address'
       },
       validate: {
        notAdmin: (fieldValue) =>{
          return (
             fieldValue !== "admin@example.com" || "Enter a different email address"
          )
        },
        notBlackListed: (fieldValue) =>{
          return !fieldValue.endsWith("baddomain.com")
        }
       }
    })} />
    <p className="error">{errors?.email?.message}</p>
    </div>

    <div className="form-control">
    <label htmlFor="channel">Channel</label>
    <input type="text" id="channel" {...register("channel", {
       required: 'Username is required'
    })} />
    <p className="error">{errors?.channel?.message}</p>
    </div>

    <button>Submit</button>
    <DevTool control={control} />
  </form>
  )
}

export default YoutubeForm