import { useForm, useFieldArray, FieldErrors } from "react-hook-form"
import { DevTool } from "@hookform/devtools"
import { useEffect } from "react"

type FormValues = {
  username: string,
  email: string,
  channel: string,
  social: {
    twitter: string,
    facebook: string,
  },
  phoneNumbers: string[],
  phNumbers: {
    number: string,
  }[],
  age: number,
  dob: Date,
}

const YoutubeForm = () => {
const getFieldValues = async () =>{
  const response = await fetch('https://jsonplaceholder.typicode.com/users/1')
  const data = await response.json()
  return data;
}

  const form = useForm<FormValues>({
    defaultValues: async () =>{
      const res = await getFieldValues()
      return {
        username: res.username,
        email: res.email,
        channel: "",
        social: {
          twitter: '',
          facebook: '',
        },
        phoneNumbers: ["", ""],
        phNumbers: [{number: ''}],
        age: 0,
        dob: new Date(),
      }
    }
  });
  const {register, control, handleSubmit, formState, reset, watch, getValues, setValue} = form; 
  const {errors, touchedFields, dirtyFields, isDirty, isValid, isSubmitting, isSubmitted, isSubmitSuccessful, submitCount } = formState; 

  console.log(isSubmitting, isSubmitted, isSubmitSuccessful, submitCount, "isSubmitting, isSubmitted");
  

  // console.log({touchedFields, dirtyFields, isDirty, isValid}, "touchedFields, dirtyFields");
  

  const { fields, append, remove } = useFieldArray({
    name: 'phNumbers',
    control
  })

  const onError = (errors: FieldErrors<FormValues>) =>{
     console.log("Form errors ", errors);
  }

  const onSubmit = (data:FormValues) =>{
    console.log("form submitted", data);
    // alert(JSON.stringify(data))
    reset();
  }

  const watchUsername = watch("username")

  useEffect(() =>{
     const subscription = watch((value) =>{
      // console.log(value, "value");
     })
     return () => subscription.unsubscribe()
  }, [watch])


  const handleGetValues = () =>{
     console.log("Get values", getValues("social"));
  }

  const handleSetValues = () =>{
     setValue("username", "", {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true
    })
     setValue("email", "", {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true
    })
  }

  return (
    <>
    <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
   <h1>{watchUsername}</h1>
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
        },
        emailAvailable: async (fieldValue) =>{
          const response = await fetch(`https://jsonplaceholder.typicode.com/users?email=${fieldValue}`)
          const data = await response.json()
          return data.length === 0 || "Email already exist"
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

    <div className="form-control">
    <label htmlFor="twitter">Twitter</label>
    <input type="text" id="twitter" {...register("social.twitter", {disabled: true, required: "Twitter is required"})} />
    </div>

    <div className="form-control">
    <label htmlFor="facebook">Facebook</label>
    <input type="text" id="facebook" {...register("social.facebook", {disabled: watch("channel") === "", required: "facebook is required"})} />
    </div>

    <div className="form-control">
    <label htmlFor="primary-phone">Primary Phone Number</label>
    <input type="text" id="primary-phone" {...register("phoneNumbers.0")} />
    </div>

    <div className="form-control">
    <label htmlFor="secondary-phone">Secondary Phone Number</label>
    <input type="text" id="secondary-phone" {...register("phoneNumbers.1")} />
    </div>

    <div>
      <label>List of Phone Numbers</label>
      <div>
        {fields.map((field, index) => {
          return (
            <>
            {index > 0 && <div className="form-control" key={field.id} style={{display: 'flex'}}>
             <div>
             <input type="text" 
              {...register(`phNumbers.${index}.number` as const)}
             />
             </div>
             <div>
                <button className="btn" type="button" 
                onClick={()=> remove(index)}>Remove</button>        
             </div>
          </div>}
            </>
          )
        })}
        <button className="btn" type="button" 
        onClick={()=> append({number: ""})}>Add Phone Number</button>

      </div>
    </div>
    <br />

    <div className="form-control">
    <label htmlFor="age">Age</label>
    <input type="number" id="age" {...register("age", {
      valueAsNumber: true,
       required: {
        value: true,
        message: 'Age is required',
       }
    })} />
    <p className="error">{errors?.age?.message}</p>
    </div>

    <div className="form-control">
    <label htmlFor="dob">Date Of Birth</label>
    <input type="date" id="dob" {...register("dob", {
      valueAsDate: true,
       required: {
        value: true,
        message: 'date ge is required',
       }
    })} />
    <p className="error">{errors?.age?.message}</p>
    </div>

    <button disabled={!isDirty}>Submit</button> <br />
    <button onClick={handleGetValues} type="button">Get Values</button> <br />
    <button onClick={handleSetValues} type="button">Set Values</button>
  </form>
    <DevTool control={control} />
    </>
  )
}

export default YoutubeForm