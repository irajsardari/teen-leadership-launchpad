-- Add manual translations for key terms to make dictionary functional
UPDATE dictionary 
SET translations = jsonb_build_object(
  'ar', jsonb_build_object(
    'term', 'التواصل',
    'shortDef', 'تبادل المعلومات والأفكار بين الأفراد أو الجماعات.',
    'updatedAt', now()::text,
    'source', 'human'
  ),
  'fa', jsonb_build_object(
    'term', 'ارتباط',
    'shortDef', 'تبادل اطلاعات و ایده ها بین افراد یا گروه ها.',
    'updatedAt', now()::text,
    'source', 'human'
  )
)
WHERE slug = 'communication';

UPDATE dictionary 
SET translations = jsonb_build_object(
  'ar', jsonb_build_object(
    'term', 'التفكير النقدي',
    'shortDef', 'التحليل الموضوعي وتقييم القضايا لتكوين حكم.',
    'updatedAt', now()::text,
    'source', 'human'
  ),
  'fa', jsonb_build_object(
    'term', 'تفکر انتقادی',
    'shortDef', 'تجزیه و تحلیل عینی و ارزیابی موضوعات برای قضاوت.',
    'updatedAt', now()::text,
    'source', 'human'
  )
)
WHERE slug = 'critical-thinking';

UPDATE dictionary 
SET translations = jsonb_build_object(
  'ar', jsonb_build_object(
    'term', 'التعاطف',
    'shortDef', 'القدرة على فهم ومشاركة مشاعر الآخرين.',
    'updatedAt', now()::text,
    'source', 'human'
  ),
  'fa', jsonb_build_object(
    'term', 'همدلی',
    'shortDef', 'توانایی درک و به اشتراک گذاشتن احساسات دیگران.',
    'updatedAt', now()::text,
    'source', 'human'
  )
)
WHERE slug = 'empathy';

UPDATE dictionary 
SET translations = jsonb_build_object(
  'ar', jsonb_build_object(
    'term', 'القيادة',
    'shortDef', 'القدرة على توجيه وإلهام الآخرين نحو تحقيق أهداف مشتركة.',
    'updatedAt', now()::text,
    'source', 'human'
  ),
  'fa', jsonb_build_object(
    'term', 'رهبری',
    'shortDef', 'توانایی هدایت و الهام دیگران به سوی تحقق اهداف مشترک.',
    'updatedAt', now()::text,
    'source', 'human'
  )
)
WHERE slug = 'leadership';

UPDATE dictionary 
SET translations = jsonb_build_object(
  'ar', jsonb_build_object(
    'term', 'الثقافة المالية',
    'shortDef', 'المعرفة والمهارات اللازمة لاتخاذ قرارات مالية مدروسة.',
    'updatedAt', now()::text,
    'source', 'human'
  ),
  'fa', jsonb_build_object(
    'term', 'سواد مالی',
    'shortDef', 'دانش و مهارت های لازم برای اتخاذ تصمیمات مالی آگاهانه.',
    'updatedAt', now()::text,
    'source', 'human'
  )
)
WHERE slug = 'financial-literacy';