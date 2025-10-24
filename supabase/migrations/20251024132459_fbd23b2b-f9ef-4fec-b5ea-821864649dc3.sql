-- Allow users to insert their own user_status during signup
CREATE POLICY "Users can insert their own status during signup"
ON user_status
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);