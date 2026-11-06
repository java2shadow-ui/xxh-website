# -*- coding: utf-8 -*-
"""注入六语言 gd_ 文案到 i18n-grades.js（锚点：每语言的 g_ver_filter 行）"""
import io, re, json

GD = json.loads(io.open('D:/workspace/chizi/website/tools/gd_i18n.json', encoding='utf-8').read())

p = 'D:/workspace/chizi/website/i18n-grades.js'
with io.open(p, encoding='utf-8') as f:
    lines = f.read().split('\n')

order = ['en', 'zh', 'ru', 'vi', 'th', 'id']
idx = 0
out = []
for ln in lines:
    out.append(ln)
    if 'g_ver_filter:' in ln and 'gd_about_t' not in ln:
        lang = order[idx] if idx < len(order) else 'en'
        idx += 1
        indent = re.match(r'^(\s*)', ln).group(1)
        block = [indent + k + ': ' + json.dumps(v, ensure_ascii=False) + ',' for k, v in GD[lang].items()]
        out.extend(block)

with io.open(p, 'w', encoding='utf-8', newline='\n') as f:
    f.write('\n'.join(out))
print('注入语言数:', idx, '（每语言 %d 键）' % len(GD['en']))
