// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";

// export default function StepBasicInfo({ form, onChange }) {
//   return (
//     <div className="space-y-4">
//       <div>
//         <Label>Full Name</Label>
//         <Input name="name" value={form.name} onChange={onChange} required />
//       </div>

//       <div>
//         <Label>Email</Label>
//         <Input
//           name="email"
//           type="email"
//           value={form.email}
//           onChange={onChange}
//           required
//         />
//       </div>

//       <div>
//         <Label>Phone</Label>
//         <Input name="phone" value={form.phone} onChange={onChange} />
//       </div>

//       <div>
//         <Label>Password</Label>
//         <Input
//           name="password"
//           type="password"
//           value={form.password}
//           onChange={onChange}
//           required
//         />
//       </div>
//     </div>
//   );
// }


import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function StepBasicInfo({ register, errors }) {
  return (
    <div className="space-y-4">
      <div>
        <Label>Full Name</Label>
        <Input {...register("name")} />
        {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
      </div>

      <div>
        <Label>Email</Label>
        <Input type="email" {...register("email")} />
        {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
      </div>

      <div>
        <Label>Phone</Label>
        <Input {...register("phone")} />
      </div>

      <div>
        <Label>Password</Label>
        <Input type="password" {...register("password")} />
        {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
      </div>
    </div>
  );
}
