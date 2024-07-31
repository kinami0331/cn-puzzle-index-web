import csv
import os
import requests
import time

from dotenv import load_dotenv

load_dotenv()
load_dotenv('.env.local', override=True)

APP_ID = os.getenv("APP_ID")
APP_SECRET = os.getenv("APP_SECRET")
APP_TOKEN = os.getenv("APP_TOKEN")
PUZZLE_TABLE_ID = os.getenv("PUZZLE_TABLE_ID")
ACTIVITY_TABLE_ID = os.getenv("ACTIVITY_TABLE_ID")
KEYWORD_TABLE_ID = os.getenv("KEYWORD_TABLE_ID")
AUTHOR_TABLE_ID = os.getenv("AUTHOR_TABLE_ID")
CATEGORY_TABLE_ID = os.getenv("CATEGORY_TABLE_ID")

session = requests.Session()
session.headers.update({
    'Content-Type': 'application/json; charset=utf-8',
})


print('getting access token ...')
response = session.post(
    'https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal',
    json={'app_id': APP_ID, 'app_secret': APP_SECRET}
)
assert response.status_code == 200, f'network error, code: {response.status_code}'
json_res = response.json()
assert json_res['code'] == 0, f'feishu error, code: {json_res["code"]}, message: {json_res["msg"]}'
tenant_access_token = json_res['tenant_access_token']
session.headers.update({
    'Authorization': f'Bearer {tenant_access_token}',
    'Content-Type': 'application/json; charset=utf-8',
})
print('got access token!')


print('getting puzzle records ...')
get_records_url = f'https://open.feishu.cn/open-apis/bitable/v1/apps/{APP_TOKEN}/tables/{PUZZLE_TABLE_ID}/records/search'
response = session.post(
    get_records_url,
    json={'filter': {
        'conjunction': 'and',
        'conditions': [{'field_name': 'key', 'operator': 'isNotEmpty', 'value': []}]
    }}
)
assert response.status_code == 200, f'network error, code: {response.status_code}'
json_res = response.json()
assert json_res['code'] == 0, f'feishu error, code: {json_res["code"]}, message: {json_res["msg"]}'
page_token = None
if json_res['data']['has_more']:
    page_token = json_res['data']['page_token']
puzzle_items = []
puzzle_items.extend(json_res['data']['items'])
while page_token is not None:
    time.sleep(1)
    print('getting more puzzle records ...')
    response = session.post(
        get_records_url,
        json={'filter': {
            'conjunction': 'and',
            'conditions': [{'field_name': 'key', 'operator': 'isNotEmpty', 'value': []}],
            'page_token': page_token,
        }}
    )
    assert response.status_code == 200, f'network error, code: {response.status_code}'
    json_res = response.json()
    assert json_res['code'] == 0, f'feishu error, code: {json_res["code"]}, message: {json_res["msg"]}'
    if json_res['data']['has_more']:
        page_token = json_res['data']['page_token']
    else:
        page_token = None
    puzzle_items.extend(json_res['data']['items'])
print('got puzzle records!')

print('writting puzzle records ...')
puzzle_list = []
for item in puzzle_items:
    fields = item['fields']
    puzzle_slug = fields['key'][0]['text']  # 约定总是单行
    puzzle_name = fields['name'][0]['text']   # 约定总是单行
    activity_slug = fields['activity_slug']
    round_or_number = fields['round_or_number'][0]['text']   # 约定总是单行
    author_slugs = fields['author_slugs']
    keyword_slugs = fields['keyword_slugs']
    puzzle_page = fields['puzzle_page']['link']
    solution_page = fields['solution_page']['link']

    puzzle_item = [
        puzzle_slug, puzzle_name, activity_slug, round_or_number,
        ','.join(author_slugs), ','.join(keyword_slugs), puzzle_page, solution_page,
    ]
    puzzle_list.append(puzzle_item)
puzzle_list.sort(key=lambda x: (x[2], x[3], x[0]))
with open('./data/puzzles.csv', 'w', newline='', encoding='utf-8') as f:
    csv_writer = csv.writer(f, quoting=csv.QUOTE_ALL)
    csv_writer.writerow([
        'slug', 'name', 'activity_slug', 'round_or_number',
        'author_slugs', 'keyword_slugs', 'puzzle_page', 'solution_page',
    ])
    for puzzle in puzzle_list:
        csv_writer.writerow(puzzle)
print('wrote puzzle records!')


print('getting activity records ...')
get_records_url = f'https://open.feishu.cn/open-apis/bitable/v1/apps/{APP_TOKEN}/tables/{ACTIVITY_TABLE_ID}/records/search'
response = session.post(
    get_records_url,
    json={'filter': {
        'conjunction': 'and',
        'conditions': [{'field_name': 'key', 'operator': 'isNotEmpty', 'value': []}]
    }}
)
assert response.status_code == 200, f'network error, code: {response.status_code}'
json_res = response.json()
assert json_res['code'] == 0, f'feishu error, code: {json_res["code"]}, message: {json_res["msg"]}'
page_token = None
if json_res['data']['has_more']:
    page_token = json_res['data']['page_token']
activity_items = []
activity_items.extend(json_res['data']['items'])
while page_token is not None:
    time.sleep(1)
    print('getting more puzzle records ...')
    response = session.post(
        get_records_url,
        json={'filter': {
            'conjunction': 'and',
            'conditions': [{'field_name': 'key', 'operator': 'isNotEmpty', 'value': []}],
            'page_token': page_token,
        }}
    )
    assert response.status_code == 200, f'network error, code: {response.status_code}'
    json_res = response.json()
    assert json_res['code'] == 0, f'feishu error, code: {json_res["code"]}, message: {json_res["msg"]}'
    if json_res['data']['has_more']:
        page_token = json_res['data']['page_token']
    else:
        page_token = None
    activity_items.extend(json_res['data']['items'])
print('got activity records!')

print('writting activity records ...')
activity_list = []
for item in activity_items:
    fields = item['fields']
    slug = fields['key'][0]['text']
    name = fields['name'][0]['text']
    if 'profile' not in fields:
        profile = ''
    else:
        profile = ''.join(list(map(lambda x: x['text'], fields['profile'])))

    activity_item = [slug, name, profile]
    activity_list.append(activity_item)
activity_list.sort(key=lambda x: (x[0]))

with open('./data/activities.csv', 'w', newline='', encoding='utf-8') as f:
    csv_writer = csv.writer(f, quoting=csv.QUOTE_ALL)
    csv_writer.writerow(['slug', 'name', 'profile'])
    for activity in activity_list:
        csv_writer.writerow(activity)
print('wrote activity records!')


print('getting activity records ...')
get_records_url = f'https://open.feishu.cn/open-apis/bitable/v1/apps/{APP_TOKEN}/tables/{ACTIVITY_TABLE_ID}/records/search'
response = session.post(
    get_records_url,
    json={'filter': {
        'conjunction': 'and',
        'conditions': [{'field_name': 'key', 'operator': 'isNotEmpty', 'value': []}]
    }}
)
assert response.status_code == 200, f'network error, code: {response.status_code}'
json_res = response.json()
assert json_res['code'] == 0, f'feishu error, code: {json_res["code"]}, message: {json_res["msg"]}'
page_token = None
if json_res['data']['has_more']:
    page_token = json_res['data']['page_token']
activity_items = []
activity_items.extend(json_res['data']['items'])
while page_token is not None:
    time.sleep(1)
    print('getting more puzzle records ...')
    response = session.post(
        get_records_url,
        json={'filter': {
            'conjunction': 'and',
            'conditions': [{'field_name': 'key', 'operator': 'isNotEmpty', 'value': []}],
            'page_token': page_token,
        }}
    )
    assert response.status_code == 200, f'network error, code: {response.status_code}'
    json_res = response.json()
    assert json_res['code'] == 0, f'feishu error, code: {json_res["code"]}, message: {json_res["msg"]}'
    if json_res['data']['has_more']:
        page_token = json_res['data']['page_token']
    else:
        page_token = None
    activity_items.extend(json_res['data']['items'])
print('got activity records!')

print('writting activity records ...')
activity_list = []
for item in activity_items:
    fields = item['fields']
    slug = fields['key'][0]['text']
    name = fields['name'][0]['text']
    if 'profile' not in fields:
        profile = ''
    else:
        profile = ''.join(list(map(lambda x: x['text'], fields['profile'])))

    activity_item = [slug, name, profile]
    activity_list.append(activity_item)
activity_list.sort(key=lambda x: (x[0]))

with open('./data/activities.csv', 'w', newline='', encoding='utf-8') as f:
    csv_writer = csv.writer(f, quoting=csv.QUOTE_ALL)
    csv_writer.writerow(['slug', 'name', 'profile'])
    for activity in activity_list:
        csv_writer.writerow(activity)
print('wrote activity records!')


print('getting keyword records ...')
get_records_url = f'https://open.feishu.cn/open-apis/bitable/v1/apps/{APP_TOKEN}/tables/{KEYWORD_TABLE_ID}/records/search'
response = session.post(
    get_records_url,
    json={'filter': {
        'conjunction': 'and',
        'conditions': [{'field_name': 'key', 'operator': 'isNotEmpty', 'value': []}]
    }}
)
assert response.status_code == 200, f'network error, code: {response.status_code}'
json_res = response.json()
assert json_res['code'] == 0, f'feishu error, code: {json_res["code"]}, message: {json_res["msg"]}'
page_token = None
if json_res['data']['has_more']:
    page_token = json_res['data']['page_token']
keyword_items = []
keyword_items.extend(json_res['data']['items'])
while page_token is not None:
    time.sleep(1)
    print('getting more puzzle records ...')
    response = session.post(
        get_records_url,
        json={'filter': {
            'conjunction': 'and',
            'conditions': [{'field_name': 'key', 'operator': 'isNotEmpty', 'value': []}],
            'page_token': page_token,
        }}
    )
    assert response.status_code == 200, f'network error, code: {response.status_code}'
    json_res = response.json()
    assert json_res['code'] == 0, f'feishu error, code: {json_res["code"]}, message: {json_res["msg"]}'
    if json_res['data']['has_more']:
        page_token = json_res['data']['page_token']
    else:
        page_token = None
    keyword_items.extend(json_res['data']['items'])
print('got keyword records!')

print('writting keyword records ...')
keyword_list = []
for item in keyword_items:
    fields = item['fields']
    slug = fields['key'][0]['text']
    name = fields['name'][0]['text']
    category_slugs = fields['category_slugs']
    if 'profile' not in fields:
        profile = ''
    else:
        profile = ''.join(list(map(lambda x: x['text'], fields['profile'])))

    keyword_item = [slug, name, ','.join(category_slugs), profile]
    keyword_list.append(keyword_item)
keyword_list.sort(key=lambda x: (x[0]))

with open('./data/keywords.csv', 'w', newline='', encoding='utf-8') as f:
    csv_writer = csv.writer(f, quoting=csv.QUOTE_ALL)
    csv_writer.writerow(['slug', 'name', 'category_slugs', 'profile'])
    for keyword in keyword_list:
        csv_writer.writerow(keyword)
print('wrote keyword records!')


print('getting author records ...')
get_records_url = f'https://open.feishu.cn/open-apis/bitable/v1/apps/{APP_TOKEN}/tables/{AUTHOR_TABLE_ID}/records/search'
response = session.post(
    get_records_url,
    json={'filter': {
        'conjunction': 'and',
        'conditions': [{'field_name': 'key', 'operator': 'isNotEmpty', 'value': []}]
    }}
)
assert response.status_code == 200, f'network error, code: {response.status_code}'
json_res = response.json()
assert json_res['code'] == 0, f'feishu error, code: {json_res["code"]}, message: {json_res["msg"]}'
page_token = None
if json_res['data']['has_more']:
    page_token = json_res['data']['page_token']
author_items = []
author_items.extend(json_res['data']['items'])
while page_token is not None:
    time.sleep(1)
    print('getting more puzzle records ...')
    response = session.post(
        get_records_url,
        json={'filter': {
            'conjunction': 'and',
            'conditions': [{'field_name': 'key', 'operator': 'isNotEmpty', 'value': []}],
            'page_token': page_token,
        }}
    )
    assert response.status_code == 200, f'network error, code: {response.status_code}'
    json_res = response.json()
    assert json_res['code'] == 0, f'feishu error, code: {json_res["code"]}, message: {json_res["msg"]}'
    if json_res['data']['has_more']:
        page_token = json_res['data']['page_token']
    else:
        page_token = None
    author_items.extend(json_res['data']['items'])
print('got author records!')

print('writting author records ...')
author_list = []
for item in author_items:
    fields = item['fields']
    slug = fields['key'][0]['text']
    name = fields['name'][0]['text']
    if 'profile' not in fields:
        profile = ''
    else:
        profile = ''.join(list(map(lambda x: x['text'], fields['profile'])))

    author_item = [slug, name, profile]
    author_list.append(author_item)
author_list.sort(key=lambda x: (x[0]))

with open('./data/authors.csv', 'w', newline='', encoding='utf-8') as f:
    csv_writer = csv.writer(f, quoting=csv.QUOTE_ALL)
    csv_writer.writerow(['slug', 'name', 'profile'])
    for author in author_list:
        csv_writer.writerow(author)
print('wrote author records!')


print('getting category records ...')
get_records_url = f'https://open.feishu.cn/open-apis/bitable/v1/apps/{APP_TOKEN}/tables/{CATEGORY_TABLE_ID}/records/search'
response = session.post(
    get_records_url,
    json={'filter': {
        'conjunction': 'and',
        'conditions': [{'field_name': 'key', 'operator': 'isNotEmpty', 'value': []}]
    }}
)
assert response.status_code == 200, f'network error, code: {response.status_code}'
json_res = response.json()
assert json_res['code'] == 0, f'feishu error, code: {json_res["code"]}, message: {json_res["msg"]}'
page_token = None
if json_res['data']['has_more']:
    page_token = json_res['data']['page_token']
category_items = []
category_items.extend(json_res['data']['items'])
while page_token is not None:
    time.sleep(1)
    print('getting more puzzle records ...')
    response = session.post(
        get_records_url,
        json={'filter': {
            'conjunction': 'and',
            'conditions': [{'field_name': 'key', 'operator': 'isNotEmpty', 'value': []}],
            'page_token': page_token,
        }}
    )
    assert response.status_code == 200, f'network error, code: {response.status_code}'
    json_res = response.json()
    assert json_res['code'] == 0, f'feishu error, code: {json_res["code"]}, message: {json_res["msg"]}'
    if json_res['data']['has_more']:
        page_token = json_res['data']['page_token']
    else:
        page_token = None
    category_items.extend(json_res['data']['items'])
print('got category records!')

print('writting category records ...')
category_list = []
for item in category_items:
    fields = item['fields']
    slug = fields['key'][0]['text']
    name = fields['name'][0]['text']
    parent_slug = fields.get('parent_slug', '')
    if 'profile' not in fields:
        profile = ''
    else:
        profile = ''.join(list(map(lambda x: x['text'], fields['profile'])))

    category_item = [slug, name, profile, parent_slug]
    category_list.append(category_item)
category_list.sort(key=lambda x: (x[0]))

with open('./data/categories.csv', 'w', newline='', encoding='utf-8') as f:
    csv_writer = csv.writer(f, quoting=csv.QUOTE_ALL)
    csv_writer.writerow(['slug', 'name', 'profile', 'parent_slug'])
    for category in category_list:
        csv_writer.writerow(category)
print('wrote category records!')
