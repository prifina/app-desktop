export const UserDataConnectors=[
  {
    "mockupFunction": "getDailiesMockupData",
    "mockup": "queryDailiesDataAsync",
    "mockupModule": "@dynamic-data/garmin-mockups",
    "partitions": [
      "day",
      "period"
    ],
    "queryType": "ASYNC",
    "orderBy": "day desc",
    "source": "ATHENA",
    "id": "Garmin/queryDailiesDataAsync",
    "dataModel": "DailiesData",
    "sql": "SELECT * FROM core_athena_tables.garmin_dailies_data"
  },
  {
    "mockupFunction": "getPulseoxMockupData",
    "mockup": "queryPulseoxDataAsync",
    "mockupModule": "@dynamic-data/garmin-mockups",
    "partitions": [
      "day",
      "period"
    ],
    "queryType": "ASYNC",
    "orderBy": "day desc",
    "source": "ATHENA",
    "id": "Garmin/queryPulseoxDataAsync",
    "dataModel": "PulseoxData",
    "sql": "SELECT * FROM core_athena_tables.garmin_pulseox_data"
  },
  {
    "partitions": [
      "day"
    ],
    "source": "S3",
    "bucket": "prifina-user",
    "mockupFunction": "getHeartRateSummary",
    "objectName": "summary.json",
    "mockup": "queryHeartRateSummary",
    "mockupModule": "@dynamic-data/fitbit-mockups",
    "queryType": "SYNC",
    "input": "JSON",
    "id": "Fitbit/queryHeartRateSummary",
    "dataModel": "HeartRateSummary",
    "s3Key": "fitbit/heartrate/summary"
  },
  {
    "mockupFunction": "getSleepsMockupData",
    "objectName": "summary.json",
    "mockupModule": "@dynamic-data/garmin-mockups",
    "partitions": [
      "day"
    ],
    "queryType": "SYNC",
    "input": "JSON",
    "source": "S3",
    "bucket": "prifina-user",
    "id": "Garmin/querySleepsData",
    "dataModel": "SleepsData",
    "s3Key": "garmin/sleeps/data"
  },
  {
    "partitions": [
      "day"
    ],
    "source": "S3",
    "bucket": "prifina-user",
    "mockupFunction": "getActivityMockupData",
    "objectName": "summary.json",
    "mockup": "queryActivitySummary",
    "mockupModule": "@dynamic-data/oura-mockups",
    "queryType": "SYNC",
    "input": "JSON",
    "id": "Oura/queryActivitySummary",
    "dataModel": "ActivitySummary",
    "s3Key": "oura/activity/summary"
  },
  {
    "partitions": [
      "day",
      "period"
    ],
    "source": "S3",
    "bucket": "prifina-user",
    "mockupFunction": "getActivitiesMockupData",
    "objectName": "data.json",
    "mockup": "queryActivities",
    "mockupModule": "@dynamic-data/fitbit-mockups",
    "queryType": "SYNC",
    "input": "JSON",
    "id": "Fitbit/queryActivities",
    "dataModel": "ActivitiesData",
    "s3Key": "fitbit/activities/data"
  },
  {
    "mockupFunction": "getReadinessMockupData",
    "mockup": "queryReadinessSummariesAsync",
    "mockupModule": "@dynamic-data/oura-mockups",
    "partitions": [
      "day",
      "period"
    ],
    "queryType": "ASYNC",
    "orderBy": "day desc,period asc",
    "source": "ATHENA",
    "id": "Oura/queryReadinessSummariesAsync",
    "dataModel": "ReadinessSummary",
    "sql": "SELECT * FROM core_athena_tables.oura_readiness_summary"
  },
  {
    "table": "UserMetaData",
    "source": "DYNAMODB",
    "id": "User/Metadata"
  },
  {
    "mockupFunction": "getEpochsMockupData",
    "mockup": "queryEpochsDataAsync",
    "mockupModule": "@dynamic-data/garmin-mockups",
    "partitions": [
      "day",
      "period"
    ],
    "queryType": "ASYNC",
    "orderBy": "day desc",
    "source": "ATHENA",
    "id": "Garmin/queryEpochsDataAsync",
    "dataModel": "EpochsData",
    "sql": "SELECT * FROM core_athena_tables.garmin_epochs_data"
  },
  {
    "mockupFunction": "getHeartRateSummary",
    "mockup": "queryHeartRateSummariesAsync",
    "mockupModule": "@dynamic-data/fitbit-mockups",
    "partitions": [
      "day"
    ],
    "queryType": "ASYNC",
    "orderBy": "day desc",
    "source": "ATHENA",
    "id": "Fitbit/queryHeartRateSummariesAsync",
    "dataModel": "HeartRateSummary",
    "sql": "SELECT * FROM core_athena_tables.fitbit_heartrate_summary"
  },
  {
    "partitions": [
      "day"
    ],
    "source": "S3",
    "bucket": "prifina-user",
    "mockupFunction": "getActivitiesSummaryData",
    "objectName": "summary.json",
    "mockup": "queryActivitySummary",
    "mockupModule": "@dynamic-data/fitbit-mockups",
    "queryType": "SYNC",
    "input": "JSON",
    "id": "Fitbit/queryActivitySummary",
    "dataModel": "ActivitiesSummary",
    "s3Key": "fitbit/activities/summary"
  },
  {
    "mockupFunction": "getSleepSummaryData",
    "mockup": "querySleepSummariesAsync",
    "mockupModule": "@dynamic-data/fitbit-mockups",
    "partitions": [
      "day",
      "period"
    ],
    "queryType": "ASYNC",
    "orderBy": "day desc,period asc",
    "source": "ATHENA",
    "id": "Fitbit/querySleepSummariesAsync",
    "dataModel": "SleepSummary",
    "sql": "SELECT * FROM core_athena_tables.fitbit_sleep_summary"
  },
  {
    "mockupFunction": "getSleepData",
    "mockup": "querySleepDataAsync",
    "mockupModule": "@dynamic-data/fitbit-mockups",
    "partitions": [
      "day",
      "period"
    ],
    "queryType": "ASYNC",
    "orderBy": "day desc,period asc",
    "source": "ATHENA",
    "id": "Fitbit/querySleepDataAsync",
    "dataModel": "SleepDataAsync",
    "sql": "SELECT * FROM core_athena_tables.fitbit_sleep_data"
  },
  {
    "fields": [
      "p_timestamp",
      "p_datetime",
      "p_type",
      "p_confidence"
    ],
    "objectName": "activities.csv",
    "mockup": "queryActivities",
    "partitions": [],
    "queryType": "SYNC",
    "input": "CSV",
    "source": "S3",
    "bucket": "prifina-user",
    "id": "GoogleTimeline/queryActivities",
    "s3Key": "google-timeline-data/activities"
  },
  {
    "partitions": [
      "day"
    ],
    "source": "S3",
    "bucket": "prifina-user",
    "mockupFunction": "getHeartRateData",
    "fields": [
      "p_date",
      "p_time",
      "p_value"
    ],
    "objectName": "data.csv",
    "mockup": "queryHeartRateData",
    "mockupModule": "@dynamic-data/fitbit-mockups",
    "queryType": "SYNC",
    "input": "CSV",
    "id": "Fitbit/queryHeartRateData",
    "dataModel": "HeartRateData",
    "s3Key": "fitbit/heartrate/data"
  },
  {
    "table": "Messaging",
    "source": "DYNAMODB",
    "id": "Messaging/mutationCreateMessage"
  },
  {
    "mockupFunction": "getSleepQualityData",
    "mockup": "querySleepQualityAsync",
    "mockupModule": "@dynamic-data/fitbit-mockups",
    "partitions": [
      "day"
    ],
    "queryType": "ASYNC",
    "orderBy": "day desc",
    "source": "ATHENA",
    "id": "Fitbit/querySleepQualityAsync",
    "dataModel": "SleepQuality",
    "sql": "SELECT * FROM core_athena_tables.fitbit_sleepquality_data"
  },
  {
    "mockupFunction": "getSleepMockupData",
    "mockup": "querySleepSummariesAsync",
    "mockupModule": "@dynamic-data/oura-mockups",
    "partitions": [
      "day",
      "period"
    ],
    "queryType": "ASYNC",
    "orderBy": "day desc,period asc",
    "source": "ATHENA",
    "id": "Oura/querySleepSummariesAsync",
    "dataModel": "SleepSummary",
    "sql": "SELECT * FROM core_athena_tables.oura_sleep_summary"
  },
  {
    "table": "Messaging",
    "source": "DYNAMODB",
    "id": "Messaging/queryGetMessages"
  },
  {
    "partitions": [
      "day",
      "period"
    ],
    "source": "S3",
    "bucket": "prifina-user",
    "mockupFunction": "getSleepMockupData",
    "objectName": "summary.json",
    "mockup": "querySleepSummary",
    "mockupModule": "@dynamic-data/oura-mockups",
    "queryType": "SYNC",
    "input": "JSON",
    "id": "Oura/querySleepSummary",
    "dataModel": "SleepSummary",
    "s3Key": "oura/sleep/summary"
  },
  {
    "partitions": [
      "day"
    ],
    "source": "S3",
    "bucket": "prifina-user",
    "mockupFunction": "getSleepQualityData",
    "fields": [
      "p_timestamp",
      "p_datetime",
      "p_value",
      "p_level"
    ],
    "objectName": "data.csv",
    "mockup": "querySleepQuality",
    "mockupModule": "@dynamic-data/fitbit-mockups",
    "queryType": "SYNC",
    "input": "CSV",
    "id": "Fitbit/querySleepQuality",
    "dataModel": "SleepQuality",
    "s3Key": "fitbit/sleepquality/data"
  },
  {
    "table": "AddressBook",
    "source": "DYNAMODB",
    "id": "Messaging/queryUserAddressBook"
  },
  {
    "mockupFunction": "getActivitiesMockupData",
    "mockup": "queryActivitiesAsync",
    "mockupModule": "@dynamic-data/fitbit-mockups",
    "partitions": [
      "day",
      "period"
    ],
    "queryType": "ASYNC",
    "orderBy": "day desc,period asc",
    "source": "ATHENA",
    "id": "Fitbit/queryActivitiesAsync",
    "dataModel": "ActivitiesData",
    "sql": "SELECT * FROM core_athena_tables.fitbit_activity_data"
  },
  {
    "partitions": [
      "day",
      "period"
    ],
    "source": "S3",
    "bucket": "prifina-user",
    "mockupFunction": "getSleepSummaryData",
    "objectName": "summary.json",
    "mockup": "querySleepSummary",
    "mockupModule": "@dynamic-data/fitbit-mockups",
    "queryType": "SYNC",
    "input": "JSON",
    "id": "Fitbit/querySleepSummary",
    "dataModel": "SleepSummary",
    "s3Key": "fitbit/sleep/summary"
  },
  {
    "mockupFunction": "getHeartRateData",
    "mockup": "queryHeartRateDataAsync",
    "mockupModule": "@dynamic-data/fitbit-mockups",
    "partitions": [
      "day"
    ],
    "queryType": "ASYNC",
    "orderBy": "day desc",
    "source": "ATHENA",
    "id": "Fitbit/queryHeartRateDataAsync",
    "dataModel": "HeartRateData",
    "sql": "SELECT * FROM core_athena_tables.fitbit_heartrate_data"
  },
  {
    "partitions": [
      "day"
    ],
    "source": "S3",
    "bucket": "prifina-user",
    "mockupFunction": "getSleepMockupData",
    "objectName": "data.json",
    "mockup": "querySleepData",
    "mockupModule": "@dynamic-data/oura-mockups",
    "queryType": "SYNC",
    "input": "JSON",
    "id": "Oura/querySleepData",
    "dataModel": "SleepData",
    "s3Key": "oura/sleep/data"
  },
  {
    "mockupFunction": "getActivityMockupData",
    "mockup": "queryActivitySummariesAsync",
    "mockupModule": "@dynamic-data/oura-mockups",
    "partitions": [
      "day"
    ],
    "queryType": "ASYNC",
    "orderBy": "day desc",
    "source": "ATHENA",
    "id": "Oura/queryActivitySummariesAsync",
    "dataModel": "ActivitySummary",
    "sql": "SELECT * FROM core_athena_tables.oura_activity_summary"
  },
  {
    "partitions": [
      "day",
      "period"
    ],
    "source": "S3",
    "bucket": "prifina-user",
    "mockupFunction": "getReadinessMockupData",
    "objectName": "summary.json",
    "mockup": "queryReadinessSummary",
    "mockupModule": "@dynamic-data/oura-mockups",
    "queryType": "SYNC",
    "input": "JSON",
    "id": "Oura/queryReadinessSummary",
    "dataModel": "ReadinessSummary",
    "s3Key": "oura/readiness/summary"
  },
  {
    "mockupFunction": "getSleepMockupData",
    "mockup": "querySleepsDataAsync",
    "mockupModule": "@dynamic-data/garmin-mockups",
    "partitions": [
      "day",
      "period"
    ],
    "queryType": "ASYNC",
    "orderBy": "day desc",
    "source": "ATHENA",
    "id": "Garmin/querySleepsDataAsync",
    "dataModel": "SleepsData",
    "sql": "SELECT * FROM core_athena_tables.garmin_sleeps_data"
  },
  {
    "mockupFunction": "getSleepMockupData",
    "mockup": "querySleepDataAsync",
    "mockupModule": "@dynamic-data/oura-mockups",
    "partitions": [
      "day"
    ],
    "queryType": "ASYNC",
    "orderBy": "day desc",
    "source": "ATHENA",
    "id": "Oura/querySleepDataAsync",
    "dataModel": "SleepData",
    "sql": "SELECT * FROM core_athena_tables.oura_sleep_data"
  },
  {
    "partitions": [
      "day",
      "period"
    ],
    "source": "S3",
    "bucket": "prifina-user",
    "mockupFunction": "getSleepData",
    "fields": [
      "p_timestamp",
      "p_datetime",
      "p_level",
      "p_seconds"
    ],
    "objectName": "data.csv",
    "mockup": "querySleepData",
    "mockupModule": "@dynamic-data/fitbit-mockups",
    "queryType": "SYNC",
    "input": "CSV",
    "id": "Fitbit/querySleepData",
    "dataModel": "SleepData",
    "s3Key": "fitbit/sleep/data"
  },
  {
    "mockupFunction": "getActivitiesSummaryData",
    "mockup": "queryActivitySummariesAsync",
    "mockupModule": "@dynamic-data/fitbit-mockups",
    "partitions": [
      "day"
    ],
    "queryType": "ASYNC",
    "orderBy": "day desc",
    "source": "ATHENA",
    "id": "Fitbit/queryActivitySummariesAsync",
    "dataModel": "ActivitiesSummary",
    "sql": "SELECT * FROM core_athena_tables.fitbit_activity_summary"
  },
  {
    "mockupFunction": "getDailiesMockupData",
    "objectName": "summary.json",
    "mockupModule": "@dynamic-data/garmin-mockups",
    "partitions": [
      "day"
    ],
    "queryType": "SYNC",
    "input": "JSON",
    "source": "S3",
    "bucket": "prifina-user",
    "id": "Garmin/queryDailiesData",
    "dataModel": "DailiesData",
    "s3Key": "garmin/dailies/data"
  }
]