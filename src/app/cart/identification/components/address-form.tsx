'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createShippingAddressSchema, type CreateShippingAddressInput } from '@/actions/create-shipping-address/schema'

interface AddressFormProps {
  onReady: (getValues: () => CreateShippingAddressInput, isValid: () => Promise<boolean>) => void
}

export function AddressForm({ onReady }: AddressFormProps) {
  const form = useForm<CreateShippingAddressInput>({
    resolver: zodResolver(createShippingAddressSchema),
    defaultValues: {
      country: 'Brasil',
      savedForFuture: false,
    },
  })

  onReady(
    () => form.getValues(),
    () => form.trigger(),
  )

  const handleZipBlur = async (zip: string) => {
    const clean = zip.replace(/\D/g, '')
    if (clean.length !== 8) return
    try {
      const res = await fetch(`https://viacep.com.br/ws/${clean}/json/`)
      const data = await res.json()
      if (!data.erro) {
        form.setValue('state', data.uf, { shouldValidate: true })
        form.setValue('city', data.localidade, { shouldValidate: true })
        form.setValue('neighborhood', data.bairro, { shouldValidate: true })
        form.setValue('street', data.logradouro, { shouldValidate: true })
      }
    } catch {
      // silently ignore ViaCEP errors
    }
  }

  return (
    <Form {...form}>
      <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2">
        {/* Nome completo */}
        <FormField
          control={form.control}
          name="recipientName"
          render={({ field }) => (
            <FormItem className="sm:col-span-2">
              <FormLabel>Nome completo</FormLabel>
              <FormControl><Input placeholder="Maria Silva" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail</FormLabel>
              <FormControl><Input type="email" placeholder="maria@email.com" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Telefone */}
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefone</FormLabel>
              <FormControl><Input placeholder="(11) 99999-9999" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* CPF */}
        <FormField
          control={form.control}
          name="taxId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CPF</FormLabel>
              <FormControl><Input placeholder="000.000.000-00" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* CEP */}
        <FormField
          control={form.control}
          name="zipCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CEP</FormLabel>
              <FormControl>
                <Input
                  placeholder="00000-000"
                  {...field}
                  onBlur={(e) => {
                    field.onBlur()
                    handleZipBlur(e.target.value)
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Estado */}
        <FormField
          control={form.control}
          name="state"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estado</FormLabel>
              <FormControl><Input placeholder="SP" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Cidade */}
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cidade</FormLabel>
              <FormControl><Input placeholder="São Paulo" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Bairro */}
        <FormField
          control={form.control}
          name="neighborhood"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bairro</FormLabel>
              <FormControl><Input placeholder="Centro" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Rua */}
        <FormField
          control={form.control}
          name="street"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rua</FormLabel>
              <FormControl><Input placeholder="Av. Paulista" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Número */}
        <FormField
          control={form.control}
          name="number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número</FormLabel>
              <FormControl><Input placeholder="100" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Complemento */}
        <FormField
          control={form.control}
          name="complement"
          render={({ field }) => (
            <FormItem className="sm:col-span-2">
              <FormLabel>Complemento <span className="text-muted-foreground font-normal normal-case">(opcional)</span></FormLabel>
              <FormControl><Input placeholder="Apto 42, bloco B" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* País (readonly) */}
        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem className="hidden">
              <FormControl><Input {...field} /></FormControl>
            </FormItem>
          )}
        />

        {/* Salvar para próxima vez */}
        <FormField
          control={form.control}
          name="savedForFuture"
          render={({ field }) => (
            <FormItem className="sm:col-span-2">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="savedForFuture"
                  checked={field.value}
                  onChange={field.onChange}
                  className="h-4 w-4 cursor-pointer accent-primary"
                />
                <Label htmlFor="savedForFuture" className="cursor-pointer text-sm font-normal normal-case tracking-normal">
                  Salvar endereço para próximas compras
                </Label>
              </div>
            </FormItem>
          )}
        />
      </div>
    </Form>
  )
}
