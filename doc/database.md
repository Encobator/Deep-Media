# Database Design

## user

| key | type | comment |
|-----|------|---------|
| id |
| wxid |  | 微信id |
| uuid |  | User Unique ID |
| username | |
| password |
| register_time |
| last_action_time |
| is_admin | int | 0 is not, 1 is yes |

## chat_content

| key | type | comment |
|-----|------|---------|
| id |
| uuid |
| from | int | 0 is from admin, 1 is from user |
| time | DATETIME |
| content | TINYTEXT |

## project

| key | type | comment |
|-----|------|---------|
| id |
| puid |
| uuid |
| name |
| img |
| start_date_time |
| description |

## project_update

| key | type | comment |
|-----|------|---------|
| id |
| puid |
| uuid |
| push | TINYINT | 0 is not push, 1 is push |
| date_time |
|

## project_owner

| key | type | comment |
|-----|------|---------|
| id |
| puid |
| uuid |

## project_responser

| key | type | comment |
|-----|------|---------|
| id |
| puid |
| uuid |

## project_feedback

| key | type | comment |
|-----|------|---------|
| id |
| puid |
| uuid | | update uid, can be null |
| uuid |
| date_time |
| content |
|


## performer_request

| key | type | comment |
|-----|------|---------|
| id |
| ruid |
| puid |
| position | VARCHAR(100) |
| limit | int |
| salary | INT |
| time_request_start | DATETIME |
| time_request_end | DATETIME |
| time_span_request | INT |
| description | TINYTEXT |
| post_date_time |
| deadline_date_time |

## performer

| key | type | comment |
|-----|------|---------|
| id |
| uuid |
| ruid |
| name |
| mobile |
| post_date_time |
| status | INT |
