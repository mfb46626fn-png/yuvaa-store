-- 1. Yetim (Sahipsiz) Profilleri Temizle
-- Eğer auth.users tablosundan silinmiş ama public.profiles tablosunda kalmış kayıtlar varsa,
-- bu kayıtlar yeni kayıt olurken çakışma (telefon no vb.) yaratır. Bunları siliyoruz:
DELETE FROM public.profiles 
WHERE id NOT IN (SELECT id FROM auth.users);

-- 2. Gelecekte aynı sorunu yaşamamak için 'ON DELETE CASCADE' ekle
-- Önce mevcut Foreign Key (Yabancı Anahtar) kısıtlamasını bulup kaldıralım:
DO $$ 
DECLARE 
  constraint_name text;
BEGIN
  SELECT tc.constraint_name INTO constraint_name
  FROM information_schema.table_constraints AS tc
  JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
  WHERE tc.table_name = 'profiles' AND kcu.column_name = 'id' AND tc.constraint_type = 'FOREIGN KEY';

  IF constraint_name IS NOT NULL THEN
    EXECUTE 'ALTER TABLE public.profiles DROP CONSTRAINT ' || constraint_name;
  END IF;
END $$;

-- 3. CASCADE özelliği ile yeni kısıtlamayı ekleyelim
-- Bu sayede Supabase Dashboard'dan kullanıcı sildiğinizde, profiles tablosundaki verisi de otomatik silinir.
ALTER TABLE public.profiles
ADD CONSTRAINT profiles_id_fkey
FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
