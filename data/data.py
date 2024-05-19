import pandas as pd
import math
import numpy as np
import json 

# This file is not optimal and its frowned upon to iterate over dataframe
data_json = {}

CSV_LOC = "data/Weekly_United_States_COVID-19_Cases_and_Deaths_by_County_-_ARCHIVED_20240517.csv"
df = pd.read_csv(CSV_LOC)
print(df.head())

df_mins = df.agg('min')
df_maxs = df.agg('max')

grouped_by_date = df.groupby(by='date')

data_json['weeks'] = sorted(list(grouped_by_date.groups.keys()))

data_json['cumulative_cases'] = {
    'max': int(df_maxs['cumulative_cases']),
    'min': int(df_mins['cumulative_cases']),
}

data_json['cumulative_deaths'] = {
    'max': int(df_maxs['cumulative_deaths']),
    'min': int(df_mins['cumulative_deaths'])
}

data_json['new_deaths'] = {
    'max': int(df_maxs['new_deaths']),
    'min': int(df_mins['new_deaths'])
} 

data_json['new_cases'] = {
    'max': int(df_maxs['new_cases']),
    'min': int(df_mins['new_cases'])
} 

data_json['date'] = {
    'max': df_maxs['date'],
    'min': df_mins['date']
}

for date, dataframe in grouped_by_date:
    group_mins = dataframe.agg('min')
    group_maxs = dataframe.agg('max')
    data_json[date]  = {}
    data_json[date]['cumulative_cases'] = {
        'max': int(group_maxs['cumulative_cases']),
        'min': int(group_mins['cumulative_cases']),
    }

    data_json[date]['cumulative_deaths'] = {
        'max': int(group_maxs['cumulative_deaths']),
        'min': int(group_mins['cumulative_deaths'])
    }

    data_json[date]['new_deaths'] = {
        'max': int(group_maxs['new_deaths']),
        'min': int(group_mins['new_deaths'])
    } 

    data_json[date]['new_cases'] = {
        'max': int(group_maxs['new_cases']),
        'min': int(group_mins['new_cases'])
    } 

    data_json[date]['date'] = {
        'max': group_maxs['date'],
        'min': group_mins['date']
    }

    data_json[date]['data'] = []

    for row in dataframe.itertuples(): # can't just use dict() throws
        
        #we cant have a dict key with slashes
        data_json[date]['data'].append({
            'fips': int(row.fips_code),
            'county': str(row.county),
            'cumulative_deaths': int(row.cumulative_deaths),
            'cumulative_cases': int(row.cumulative_cases),
            'new_deaths': int(row.new_deaths),
            'new_cases': int(row.new_cases),
        })

with open("data/covid_cases_by_week.json", "w") as outfile:
    json.dump(data_json, outfile)