#!/bin/sh

CLIENT=$1
if [ "$CLIENT" = "" ]; then
  echo "missing client name" 1>&2
  exit
fi

CL_CRT=./${CLIENT}.crt
CL_KEY=./${CLIENT}.key

if [ ! -f $CL_CRT ]; then
  echo "no such file: $CL_CRT" 1>&2
  exit
fi

if [ ! -f $CL_KEY ]; then
  echo "no such file: $CL_KEY" 1>&2
  exit
fi

CONF=${CLIENT}-emb.ovpn

cat base-client.ovpn > $CONF

echo "<ca>" >> $CONF
cat ca.crt | \
  grep -A 100 "BEGIN CERTIFICATE" | \
  grep -B 100 "END CERTIFICATE" >> $CONF
echo "</ca>" >> $CONF

echo "<cert>" >> $CONF
cat $CL_CRT | \
  grep -A 100 "BEGIN CERTIFICATE" | \
  grep -B 100 "END CERTIFICATE" >> $CONF
echo "</cert>" >> $CONF
echo "<key>" >> $CONF
cat $CL_KEY | \
  grep -A 100 "BEGIN PRIVATE KEY" | \
  grep -B 100 "END PRIVATE KEY" >> $CONF
echo "</key>" >> $CONF
echo "<tls-auth>" >> $CONF
cat pfs.key >> $CONF
echo "</tls-auth>" >> $CONF
